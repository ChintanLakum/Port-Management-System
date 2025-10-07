const express = require("express");
const Ship = require("../Models/Ship");
const multer = require("multer");
const path = require("path");
const Port = require("../Models/Port")
const mongoose = require("mongoose")
const shipRoute = express.Router();

const { authenticateToken, authorizeAdmin, authorizeSystemAdmin } = require("../middlewares/authentication");
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

shipRoute.post("/addShip", authenticateToken, authorizeAdmin, upload.single("shipImage"), async (req, res) => {
  try {
    let { ship_name, ship_type, max_storage_capacity, storage_unit, last_port_id, last_port_name, current_port_id, current_port_name, destination_port_id, remain_storage_capacity, destination_port_name, status } = req.body;

    if (max_storage_capacity < remain_storage_capacity) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Maximum storage capacity (max_storage_capacity) cannot be less than the remaining storage capacity (remaining_storage_capacity)."
      });
    }

    if (current_port_id && current_port_id === "null") {
      console.log("Sanitizing current_port_id: changing string 'null' to true null.");
      current_port_id = null;
    }

    if (current_port_name && current_port_name === "null") {
      console.log("Sanitizing current_port_name: changing string 'null' to true null.");
      current_port_name = null;
    }

    if (current_port_id == null && current_port_name == null) {
      status = "IN ROUTE"
    }

    const img_url = req.file ? `/uploads/${req.file.filename}` : "../ship7.jpg";
    const newShip = new Ship({
      ship_name,
      img_url,
      ship_type,
      max_storage_capacity,
      storage_unit,
      remain_storage_capacity,
      status,
      current_port_id,
      current_port_name,
      last_port_id,
      last_port_name,
      destination_port_id,
      destination_port_name,
    });

    const savedShip = await newShip.save();
    if (savedShip.status == "DOCKED" && savedShip.current_port_id != null && savedShip.current_port_name != null) {
      const updatePort = await Port.findOneAndUpdate(
        { port_id: savedShip.current_port_id },
        {
          $addToSet: { list_of_ships: savedShip.ship_id },
          $inc: { available_ships: 1 },
        },
        {
          new: true,
          runValidators: true
        }
      );
    }
    if (savedShip) {
      res.status(201).json({
        message: "Ship added successfully!",
        ship: savedShip,
      });
    }

  } catch (error) {

    console.error("Error While Adding Ship:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

shipRoute.get('/all',authenticateToken, authorizeSystemAdmin, async (req, res) => {
  try {
    const ships = await Ship.find({});
    if (!ships) {
      return res.status(404).json({ message: "No Ships Available" });
    }
    return res.status(200).json({
      message: "Sended All Ships",
      ships,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Server Error From Server Side" });
  }
})

shipRoute.get('/inRoute', async (req, res) => {
  try {
    const ships = await Ship.find({ status: "IN ROUTE" });
    if (!ships) {
      return res.status(404).json({ message: "No Ships Available" });
    }
    return res.status(200).json({
      message: "Sended All Ships",
      ships,
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Server Error From Server Side" });
  }
})

shipRoute.get(`/all/:portId`, authenticateToken, async (req, res) => {
  const portId = req.params.portId;
  try {
    const ships = await Ship.find({ current_port_id: portId });
    if (!ships) {
      return res.status(404).json({ message: "No Ships Docked In This Port" });
    }
    return res.status(200).json({
      message: "Sended All Ships Docked In This Port",
      ships,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Server Error From Server Side" });
  }
})

shipRoute.get(`/:shipId`, async (req, res) => {
  const shipId = req.params.shipId;
  try {

    const ship = await Ship.find({ ship_id: shipId });
    if (!ship) {
      return res.status(404).json({ message: `Ship with ID ${shipId} not found.` });
    }
    return res.status(200).json({
      message: "Ship Founded Successfully",
      ship,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Server Error From Server Side" });
  }
})


shipRoute.put("/dockShip/:portId", authenticateToken, authorizeAdmin, async (req, res) => {
  const portId = req.params.portId;

  const { ship_id } = req.body;
  if (!ship_id) {
    return res.status(400).json({ message: "Ship ID is required in the request body." });
  }

  try {
    const portToDock = await Port.findOne({ port_id: portId });
    if (!portToDock) {
      return res.status(404).json({ message: `Port with ID ${portId} not found.` });
    }

    const portName = portToDock.port_name;
    const availableShips = portToDock.available_ships;
    const totalDocks = portToDock.total_docks;
    const shipUpdates = {
      current_port_id: portId,
      current_port_name: portName,
      status: "DOCKED",
    };
    if (availableShips <totalDocks) {
      const updatedShip = await Ship.findOneAndUpdate(
        { ship_id: ship_id },
        { $set: shipUpdates },
        {
          new: true,
          runValidators: true,
          context: 'query'
        }
      );

      if (!updatedShip) {
        return res.status(404).json({ message: `Ship with ID ${ship_id} not found.` });
      }
      
      const updatedPort = await Port.findOneAndUpdate(
        { port_id: portId },
        {
          $inc: { available_ships: 1 },
          $addToSet: { list_of_ships: updatedShip.ship_id },
        },
        {
          new: true,
          runValidators: true
        }
      );


      if (!updatedPort) {
        return res.status(500).json({
          message: "Ship status updated, but corresponding Port update failed. Data inconsistent."
        });
      }
      
      return res.status(200).json({
        message: `Ship successfully Docked at ${portName}.`,
        ship: updatedShip,
        port: updatedPort
      });

    }
     else{
      return res.status(409).json({ message:`All docks has been occupied wait untill someone undock ship` });
    }

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation Error: ${error.message}` });
    }
    if (error.message.includes("occupied")) {
      return res.status(409).json({ message: error.message });
    }
    console.error("Error docking ship:", error);
    return res.status(500).json({
      message: "Internal Server Error during docking process.",
      error: error.message
    });
  }
});


shipRoute.put("/unDockShip/:portId", authenticateToken, authorizeAdmin, async (req, res) => {
  const portId = req.params.portId;
  const { shipId } = req.body
  console.log(req.body)

  if (!portId) {
    return res.status(400).json({ message: "Port ID must be provided to undock the ship." });
  }

  try {
    const updatedPort = await Port.findOneAndUpdate(
      { port_id: portId },
      {
        $inc: { available_ships: -1 },
        $pull: { list_of_ships: shipId },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPort) {
      throw new Error(`Port with ID ${portId} not found.`);
    }
    if (updatedPort.available_ships < 0) {
      throw new Error(`Port capacity issue. Ship ${shipId} was likely not docked at this port.`);
    }

    const updatedShip = await Ship.findOneAndUpdate(
      { ship_id: shipId },
      {
        $set: {
          status: 'IN ROUTE',
          current_port_id: null,
          current_port_name: null
        }
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedShip) {
      throw new Error(`Ship with ID ${shipId} not found.`);
    }
    return res.status(200).json({
      message: "Ship successfully undocked and all records updated.",
      ship: updatedShip,
      port: updatedPort
    });

  } catch (error) {
    console.error("Error undocking ship and updating records:", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return res.status(statusCode).json({
      message: `Undocking failed: ${error.message}`,
      error: error.message
    });
  }
});


shipRoute.put("/updateShip/:shipId", authenticateToken, authorizeAdmin, async (req, res) => {
  const shipId = req.params.shipId;
  const updatedData = req.body;
  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({ message: "No update fields provided." });
  }

  try {
    const updatedShip = await Ship.findOneAndUpdate(
      { ship_id: shipId },
      { $set: updatedData },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedShip) {
      return res.status(404).json({ message: `Ship with ID ${shipId} not found.` });
    }

    res.status(200).json({
      message: "Ship successfully updated.",
      ship: updatedShip
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error updating ship:", error);
    res.status(500).json({
      message: "Internal Server Error during Ship update.",
      error: error.message
    });
  }
});

shipRoute.delete('/:shipId', async (req, res) => {
  const shipId = req.params.shipId;
  try {
    const existingShip = await Ship.findOne({ ship_id: shipId });
    if (!existingShip) {
      return res.status(404).json({ message: `Ship with ID ${shipId} not found.` });
    }
    if (existingShip.status == "DOCKED" && existingShip.current_port_id != null) {
      console.log("inside existing ship removal inside status == DOCKED")
      const updatePort = await Port.findOneAndUpdate(
        { port_id: existingShip.current_port_id },
        {
          $inc: { available_ships: -1 },
          $pull: { list_of_ships: shipId },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    }
    const result = await Ship.deleteOne({ ship_id: shipId });

    if (result.deletedCount === 1) {
      return res.status(204).json({ message: `Ship with Name ${existingShip.ship_name} was deleted.` });
    } else {
      return res.status(404).json({ message: `Ship with ID ${shipId} was not deleted.` });
    }
  } catch (error) {
    console.error('Database error during deletion:', error);
    return res.status(500).json({ message: 'Internal Server Error during database operation.' });
  }
});
module.exports = shipRoute;