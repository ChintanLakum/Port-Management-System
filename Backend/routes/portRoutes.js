const express = require("express");
const multer = require("multer");
const path = require("path");
const Ship = require("../Models/Ship")
const Port = require("../Models/Port");
const { authenticateToken, authorizeSystemAdmin } = require("../middlewares/authentication");

const portRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });


portRoute.post("/addPort", authenticateToken, authorizeSystemAdmin, upload.single("portPhoto"), async (req, res) => {
    try {
        const { port_id, admin_id, port_name, available_ships, total_docks, city, status } = req.body;
        if (total_docks < available_ships) {
        return res.status(400).json({
            success: false,
            message: "Validation Error: Total Docks (total_docks) cannot be less than the Available Ship (remaining_storage_capacity)."
        });
    }
        const img_url = req.file ? `/uploads/${req.file.filename}` : "../port1.jpg";
        const newPort = new Port({
            port_id,
            port_name,
            admin_id,
            city,
            total_docks,
            available_ships,
            img_url,
            status,
        });

        const savedPort = await newPort.save();
        res.status(201).json({
            message: "Port added successfully!",
            port: savedPort,
        });
    } catch (error) {
        console.error("Error creating Port:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

portRoute.get('/all', async (req, res) => {
    try {
        const ports = await Port.find({});
        if (!ports) {
            return res.status(404).json({ message: "No Ports Available" });
        }
        return res.status(200).json({
            message: "Sended All Ports",
            ports,
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Server Error From Server Side" });
    }

});

portRoute.get('/:portId', protect, async (req, res) => {
    try {
        const portId = req.params.portId;
        const port = await Port.findOne({ port_id: portId });
        if (!port) {
            return res.status(404).json({ message: "Port Not found" });
        }
        return res.status(200).json({
            message: "Port Founded Successfully",
            port,
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "No such Port available" });
    }
});

portRoute.delete('/:portId',authenticateToken, authorizeSystemAdmin,  async (req, res) => {
    const portId = req.params.portId;
    try {
    const existingPort = await Port.findOne({ port_id: portId });
    if (!existingPort) {
        return res.status(404).json({ message: `Port with ID ${portId} not found.` });
    }
    const result = await Port.deleteOne({ port_id: portId });

    if (result.deletedCount === 1) {
        return res.status(204).json({ message: `Port with Name ${existingPort.port_name} was deleted.` });
    } else {
         return res.status(404).json({ message: `Port with ID ${portId} was not deleted.` });
    }
} catch (error) {
    console.error('Database error during deletion:', error);
    return res.status(500).json({ message: 'Internal Server Error during database operation.' });
}
});

portRoute.put("/dockShip/:portId", authenticateToken, authorizeSystemAdmin, async (req, res) => {
    const portId = req.params.portId;
    const { ship_id } = req.body;

    if (!ship_id) {
        return res.status(400).json({ message: "Ship ID is required for docking." });
    }
    try {
        const updatedPort = await Port.findOneAndUpdate(
            {port_id: portId},
            {
                $addToSet: { list_of_ships: ship_id }, 
                $inc: { available_ships: 1 }, 
            },
            { 
                new: true,
                runValidators: true 
            }
        );
        if (!updatedPort) {
            console.log("inside if")
            return res.status(404).json({ message: `Port with ID ${portId} not found.` });
        }

        res.status(200).json({
            message: "Ship successfully docked and Port record updated.",
            port: updatedPort
        });

    } catch (error) {
        console.error("Error docking ship and updating port:", error);
        res.status(500).json({ 
            message: "Internal Server Error during Port update.",
            error: error.message 
        });
    }
});


// portRoute.put("/unDockShip/:portId", authenticateToken, authorizeSystemAdmin, async (req, res) => {
//     const portId = req.params.portId;
//     const { ship_id } = req.body;
//     console.log(req.body)


//     if (!ship_id) {
//         return res.status(400).json({ message: "Ship ID is required for undocking." });
//     }

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
    
//         const updatedPort = await Port.findOneAndUpdate(
//             { port_id: portId },
//             {
//                 $inc: { available_ships: -1 },
//                 $pull: { list_of_ships: ship_id }, 
//             },
//             { 
//                 new: true,
//                 runValidators: true,
//                 session 
//             }
//         );

//         if (!updatedPort) {
//             throw new Error(`Port with ID ${portId} not found.`);
//         }
//         if (updatedPort.available_ships < 0) {
//              throw new Error(`Port capacity issue. Ship ${ship_id} was likely not docked.`);
//         }
//         const updatedShip = await Ship.findOneAndUpdate(
//             { current_port_id: portId },
//             {
//                 $set: { 
//                     status: 'IN ROUTE',
//                     current_port_id: null,
//                     current_port_name: null 
//                 }
//             },
//             { new: true, session }
//         );
        
//         if (!updatedShip) {
//             throw new Error(`Ship with ID ${ship_id} not found or was not currently docked at port ${portId}.`);
//         }
//         await session.commitTransaction();
//         session.endSession();

//         res.status(200).json({
//             message: "Ship successfully undocked and all records updated.",
//             port: updatedPort
//         });

//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
        
//         console.error("Error undocking ship and updating records:", error);
//         res.status(500).json({ 
//             message: "Internal Server Error during undocking transaction.",
//             error: error.message 
//         });
//     }
// });

portRoute.put("/updatePort/:portId", authenticateToken, authorizeSystemAdmin, async (req, res) => {
    const portId = req.params.portId;
    const updatedData = req.body; 
    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: "No update fields provided." });
    }
    try {
        const updatedPort = await Port.findOneAndUpdate(
            {port_id: portId}, 
            { $set: updatedData }, 
            { 
                new: true,          
                runValidators: true, 
                context: 'query'    
            }
        );
        if (!updatedPort) {
            return res.status(404).json({ message: `Port with ID ${portId} not found.` });
        }
        res.status(200).json({
            message: "Port successfully updated.",
            port: updatedPort
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        console.error("Error updating Port:", error);
        res.status(500).json({ 
            message: "Internal Server Error during Port update.",
            error: error.message 
        });
    }
}); 


module.exports = portRoute;
