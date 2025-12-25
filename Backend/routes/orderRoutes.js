const express = require("express");
const Order = require("../Models/Order");
const User = require("../Models/User");
const Ship = require("../Models/Ship");
const { authenticateToken, authorizeAdmin } = require("../middlewares/authentication");

const orderRoute = express.Router();

/**
 * PLACE ORDER
 */
orderRoute.post("/place", authenticateToken, async (req, res) => {
  try {
    const {
      ship_id,
      user_id,
      storage,
      storage_unit,
      current_port_id,
      current_port_name,
      destination_port_id,
      destination_port_name,
    } = req.body;

    if (
      !ship_id ||
      !user_id ||
      !storage ||
      !storage_unit ||
      !current_port_id ||
      !destination_port_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields",
      });
    }

    const ship = await Ship.findOne({ ship_id });
    if (!ship) {
      return res.status(404).json({
        success: false,
        message: "Ship not found",
      });
    }

    if (ship.remain_storage_capacity < storage) {
      return res.status(400).json({
        success: false,
        message: "Insufficient ship storage capacity",
      });
    }

    const payment_id = null; // placeholder for payment gateway

    const newOrder = new Order({
      ship_id,
      user_id,
      storage,
      storage_unit,
      current_port_id,
      current_port_name,
      destination_port_id,
      destination_port_name,
      payment_id,
    });

    const placedOrder = await newOrder.save();

    ship.list_of_orders.addToSet(placedOrder.order_id);
    ship.remain_storage_capacity -= storage;
    await ship.save();

    const user = await User.findByIdAndUpdate(
      user_id,
      { $addToSet: { orders: placedOrder.order_id } },
      { new: true, runValidators: true }
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: placedOrder,
      ship,
      user,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET ORDERS BY SHIP (ADMIN)
 */
orderRoute.get(
  "/all/ship/:shipId",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { shipId } = req.params;
      const orders = await Order.find({ ship_id: shipId });

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No orders found for this ship",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        orders,
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
 * GET ORDERS BY USER
 */
orderRoute.get("/all/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user_id: userId });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
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
 * GET ORDERS BY PORT
 */
orderRoute.get("/all/port/:portId", authenticateToken, async (req, res) => {
  try {
    const { portId } = req.params;
    const orders = await Order.find({ current_port_id: portId });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this port",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
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
 * GET SINGLE ORDER
 */
orderRoute.get("/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ order_id: orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = orderRoute;