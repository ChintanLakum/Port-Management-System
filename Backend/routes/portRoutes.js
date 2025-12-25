const express = require("express");
const path = require("path");
const upload = require("../middlewares/storage");
const Ship = require("../Models/Ship");
const Port = require("../Models/Port");
const { authenticateToken, authorizeSystemAdmin } = require("../middlewares/authentication");

const portRoute = express.Router();

portRoute.post(
  "/addPort",
  authenticateToken,
  authorizeSystemAdmin,
  upload.single("portPhoto"),
  async (req, res) => {
    try {
      const {
        port_id,
        admin_id,
        port_name,
        available_ships,
        total_docks,
        city,
        status,
      } = req.body;

      // Convert numeric fields explicitly
      const totalDocksNum = Number(total_docks);
      const availableShipsNum = Number(available_ships);

      if (Number.isNaN(totalDocksNum) || Number.isNaN(availableShipsNum)) {
        return res.status(400).json({
          success: false,
          message: "total_docks and available_ships must be valid numbers",
        });
      }

      if (totalDocksNum < availableShipsNum) {
        return res.status(400).json({
          success: false,
          message:
            "Validation Error: total_docks cannot be less than available_ships",
        });
      }

      const img_url = req.file
        ? `/uploads/${req.file.filename}`
        : "/uploads/port1.jpg";

      const newPort = new Port({
        port_id,
        admin_id,
        port_name,
        city,
        total_docks: totalDocksNum,
        available_ships: availableShipsNum,
        img_url,
        status,
      });

      const savedPort = await newPort.save();

      return res.status(201).json({
        success: true,
        message: "Port added successfully",
        port: savedPort,
      });
    } catch (error) {
      console.error("Error creating port:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * GET ALL PORTS
 */
portRoute.get("/all", async (req, res) => {
  try {
    const ports = await Port.find({});

    if (ports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ports available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched all ports",
      ports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET SINGLE PORT BY ID
 */
portRoute.get(
  "/:portId",
  authenticateToken,
  async (req, res) => {
    try { 
      const { portId } = req.params;

      const port = await Port.findOne({ port_id: portId });

      if (!port) {
        return res.status(404).json({
          success: false,
          message: "Port not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Port fetched successfully",
        port,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * DELETE PORT
 */
portRoute.delete(
  "/:portId",
  authenticateToken,
  authorizeSystemAdmin,
  async (req, res) => {
    try {
      const { portId } = req.params;

      const existingPort = await Port.findOne({ port_id: portId });

      if (!existingPort) {
        return res.status(404).json({
          success: false,
          message: `Port with ID ${portId} not found`,
        });
      }

      await Port.deleteOne({ port_id: portId });

      return res.status(200).json({
        success: true,
        message: `Port ${existingPort.port_name} deleted successfully`,
      });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * DOCK SHIP
 */
portRoute.put(
  "/dockShip/:portId",
  authenticateToken,
  authorizeSystemAdmin,
  async (req, res) => {
    const { portId } = req.params;
    const { ship_id } = req.body;

    if (!ship_id) {
      return res.status(400).json({
        success: false,
        message: "ship_id is required",
      });
    }

    try {
      const port = await Port.findOne({ port_id: portId });

      if (!port) {
        return res.status(404).json({
          success: false,
          message: "Port not found",
        });
      }

      if (port.available_ships >= port.total_docks) {
        return res.status(400).json({
          success: false,
          message: "No available docks at this port",
        });
      }

      port.list_of_ships.addToSet(ship_id);
      port.available_ships += 1;

      await port.save();

      return res.status(200).json({
        success: true,
        message: "Ship docked successfully",
        port,
      });
    } catch (error) {
      console.error("Dock ship error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * UPDATE PORT
 */
portRoute.put(
  "/updatePort/:portId",
  authenticateToken,
  authorizeSystemAdmin,
  async (req, res) => {
    const { portId } = req.params;
    const updatedData = req.body;

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update fields provided",
      });
    }

    try {
      const updatedPort = await Port.findOneAndUpdate(
        { port_id: portId },
        { $set: updatedData },
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (!updatedPort) {
        return res.status(404).json({
          success: false,
          message: "Port not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Port updated successfully",
        port: updatedPort,
      });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = portRoute;