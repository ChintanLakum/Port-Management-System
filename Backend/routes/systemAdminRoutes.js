const express = require("express");
const User = require("../Models/User");
const Ship = require("../Models/Ship");
const Port = require("../Models/Port");
const Order = require("../Models/Order");
const { authenticateToken, authorizeSystemAdmin } = require("../middlewares/authentication");

const systemAdminRoute = express.Router();

/**
 * SYSTEM DASHBOARD STATISTICS
 * Accessible only by SYSTEM ADMIN
 */
systemAdminRoute.get(
  "/systemStats",
  authenticateToken,
  authorizeSystemAdmin,
  async (req, res) => {
    try {
      // Run counts in parallel for better performance
      const [totalUsers, totalShips, totalPorts, totalOrders] =
        await Promise.all([
          User.countDocuments({}),
          Ship.countDocuments({}),
          Port.countDocuments({}),
          Order.countDocuments({}),
        ]);

      return res.status(200).json({
        success: true,
        message: "System statistics fetched successfully",
        stats: {
          totalUsers,
          totalShips,
          totalPorts,
          totalOrders,
        },
      });
    } catch (error) {
      console.error("System stats error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch system statistics",
        error: error.message,
      });
    }
  }
);

module.exports = systemAdminRoute;