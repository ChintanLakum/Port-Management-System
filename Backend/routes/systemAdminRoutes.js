const express = require('express');
const User = require("../Models/User")
const Ship = require("../Models/Ship")
const Port = require("../Models/Port");
const Order = require('../Models/Order');
const systemAdminRoute = express.Router();

systemAdminRoute.get("/systemStats", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({}); 
        const totalShips = await Ship.countDocuments({}); 
        const totalPorts = await Port.countDocuments({}); 
        const totalOrders = await Order.countDocuments({});
        res.status(200).json({
            totalUsers,
            totalShips,
            totalPorts,
            totalOrders,
        });

    } catch (error) {
        console.error("Error fetching system statistics:", error);
        res.status(500).json({ 
            message: "Failed to fetch system statistics due to a server error.",
            error: error.message
        });
    }
}); 

module.exports = systemAdminRoute;
