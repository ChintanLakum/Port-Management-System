const express = require("express");
const Ship = require("../Models/Ship");
const Port = require("../Models/Port");
const upload = require("../middlewares/storage");
const cloudinary = require("cloudinary")
const { authenticateToken, authorizeAdmin } = require("../middlewares/authentication");

const shipRoute = express.Router();

/* ========================= ADD SHIP ========================= */

shipRoute.post(
  "/addShip",
  authenticateToken,
  authorizeAdmin,
  upload.single("shipImage"),
  async (req, res) => {
    try {
      const shipPhoto = req.file
      let {
        ship_name,
        ship_type,
        max_storage_capacity,
        storage_unit,
        last_port_id,
        last_port_name,
        current_port_id,
        current_port_name,
        destination_port_id,
        destination_port_name,
        remain_storage_capacity,
        status,
      } = req.body;

      max_storage_capacity = Number(max_storage_capacity);
      remain_storage_capacity = Number(remain_storage_capacity);

      if (remain_storage_capacity > max_storage_capacity) {
        return res.status(400).json({
          success: false,
          message: "Remaining capacity cannot exceed maximum capacity",
        });
      }

      if (!current_port_id || current_port_id === "null") {
        current_port_id = null;
        current_port_name = null;
        status = "IN ROUTE";
      }

      const imageUpload = await cloudinary.uploader.upload(shipPhoto.path, { resource_type: 'image' })
    const imgUrl = imageUpload.secure_url
    console.log(imageUpload.secure_url)
    console.log(imgUrl, "imgUrl")
      const ship = await Ship.create({
        ship_name,
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
        img_url: imgUrl,
      });

      if (ship.status === "DOCKED" && ship.current_port_id) {
        const port = await Port.findOne({ port_id: ship.current_port_id });
        if (!port || port.available_ships >= port.total_docks) {
          return res.status(400).json({
            success: false,
            message: "Port capacity exceeded",
          });
        }

        port.available_ships += 1;
        port.list_of_ships.addToSet(ship.ship_id);
        await port.save();
      }

      res.status(201).json({
        success: true,
        message: "Ship added successfully",
        ship,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* ========================= GET SHIPS ========================= */

shipRoute.get("/all", async (_, res) => {
  const ships = await Ship.find({});
  res.status(200).json({
    success: true,
    message: "Ships fetched successfully",
    ships,
  });
});

shipRoute.get("/inRoute", async (_, res) => {
  const ships = await Ship.find({ status: "IN ROUTE" });
  res.status(200).json({
    success: true,
    message: "In-route ships fetched successfully",
    ships,
  });
});

shipRoute.get("/all/:portId", authenticateToken, async (req, res) => {
  const ships = await Ship.find({ current_port_id: req.params.portId });
  res.status(200).json({
    success: true,
    message: "Ships for port fetched successfully",
    ships,
  });
});

shipRoute.get("/:shipId", async (req, res) => {
  const ship = await Ship.findOne({ ship_id: req.params.shipId });

  if (!ship) {
    return res.status(404).json({
      success: false,
      message: "Ship not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Ship fetched successfully",
    ship,
  });
});

/* ========================= DOCK SHIP ========================= */

shipRoute.put(
  "/dockShip/:portId",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { shipId } = req.body;
      if (!shipId) {
        return res.status(400).json({
          success: false,
          message: "shipId is required",
        });
      }

      const port = await Port.findOne({ port_id: req.params.portId });
      if (!port || port.available_ships >= port.total_docks) {
        return res.status(400).json({
          success: false,
          message: "No docks available at this port",
        });
      }

      const ship = await Ship.findOne({ ship_id: shipId });
      if (!ship || ship.status !== "IN ROUTE") {
        return res.status(400).json({
          success: false,
          message: "Ship is not available for docking",
        });
      }

      ship.status = "DOCKED";
      ship.current_port_id = port.port_id;
      ship.current_port_name = port.port_name;
      await ship.save();

      port.available_ships += 1;
      port.list_of_ships.addToSet(ship.ship_id);
      await port.save();

      res.status(200).json({
        success: true,
        message: "Ship docked successfully",
        ship,
        port,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* ========================= UNDOCK SHIP ========================= */

shipRoute.put(
  "/unDockShip/:portId",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { shipId } = req.body;
      if (!shipId) {
        return res.status(400).json({
          success: false,
          message: "shipId is required",
        });
      }

      const port = await Port.findOne({ port_id: req.params.portId });
      if (!port || !port.list_of_ships.includes(shipId)) {
        return res.status(400).json({
          success: false,
          message: "Ship not docked at this port",
        });
      }

      const ship = await Ship.findOne({ ship_id: shipId });
      if (!ship) {
        return res.status(404).json({
          success: false,
          message: "Ship not found",
        });
      }

      ship.status = "IN ROUTE";
      ship.current_port_id = null;
      ship.current_port_name = null;
      await ship.save();

      port.available_ships = Math.max(0, port.available_ships - 1);
      port.list_of_ships.pull(shipId);
      await port.save();

      res.status(200).json({
        success: true,
        message: "Ship undocked successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* ========================= UPDATE SHIP ========================= */

shipRoute.put(
  "/updateShip/:shipId",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const ship = await Ship.findOneAndUpdate(
      { ship_id: req.params.shipId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!ship) {
      return res.status(404).json({
        success: false,
        message: "Ship not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ship updated successfully",
      ship,
    });
  }
);

/* ========================= DELETE SHIP ========================= */

shipRoute.delete(
  "/:shipId",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const ship = await Ship.findOne({ ship_id: req.params.shipId });
      if (!ship) {
        return res.status(404).json({
          success: false,
          message: "Ship not found",
        });
      }

      if (ship.status === "DOCKED") {
        await Port.findOneAndUpdate(
          { port_id: ship.current_port_id },
          {
            $inc: { available_ships: -1 },
            $pull: { list_of_ships: ship.ship_id },
          }
        );
      }

      await Ship.deleteOne({ ship_id: ship.ship_id });

      res.status(200).json({
        success: true,
        message: "Ship deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = shipRoute;
