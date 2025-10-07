  const express = require("express");
  const { authenticateToken, authorizeAdmin } = require("../middlewares/authentication");
  const Order = require("../Models/Order")
  const orderRoute = express.Router();
  const User = require("../Models/User")
  const Ship = require("../Models/Ship");


  orderRoute.post("/place", authenticateToken, async (req, res) => {
    try {
      const { orderData } = req.body
      const payment_id = "";
      const { ship_id, user_id, storage_unit, current_port_id, current_port_name, destination_port_id, destination_port_name, storage, remain_storage_capacity } = req.body;
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
      const storageDecrement = remain_storage_capacity + placedOrder.storage * -1;
      const ship =await Ship.findOneAndUpdate(
        { ship_id: placedOrder.ship_id },
        {
          $addToSet: { list_of_orders: placedOrder.order_id },
          $inc:  {remain_storage_capacity: storageDecrement }
        },
        {
          new: true,
          runValidators: true
        }
      )
      const user = await User.findOneAndUpdate(
        {_id:placedOrder.user_id},
        {
          $addToSet: { orders: placedOrder.order_id },
        },
        {
          new: true,
          runValidators: true
        }
      )

    if(placedOrder && ship && user){
      res.status(200).json({
              message: "Order placed succesfully.",
              order: placedOrder,
              user:user,
              ship:ship
          });
    }


    } catch (error) {

      console.error("Error While Adding Ship:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })

  orderRoute.get("/all/ship/:shipId", authenticateToken, authorizeAdmin, async(req, res)=>{
    try{ 
        const shipId = req.params.shipId;
        const orders = await  Order.find({ship_id : shipId})

        if (!orders) {
            return res.status(404).json({ message: "Orders Not found For Ship" });
        }
        return res.status(200).json({
            message: "Order Founded Successfully",
            orders,
        });
    }
    catch(error){
       console.error(error);
        return res.status(401).json({ message: "No such Orders available" });
    }
  })

  orderRoute.get("/all/user/:userId", authenticateToken, async(req, res)=>{
    try{ 
        const userId = req.params.userId;
        // console.log(userId)
        const orders =await Order.find({user_id : userId})
        // console.log("orders", orders)
        if (!orders) {
            return res.status(404).json({ message: "Orders Not found For User" });
        }
        return res.status(200).json({
            message: "Order Founded Successfully",
            orders,
        });
    }
    catch(error){
       console.error(error);
        return res.status(401).json({ message: "No such Orders available" });
    }
  })

  orderRoute.get("/all/port/:portId", authenticateToken, async(req, res)=>{
    try{ 
        const portId = req.params.portId;
        // console.log("port Id",portId)
        const orders =await Order.find({current_port_id : portId})
        // console.log("orders", orders)
        if (!orders) {
            return res.status(404).json({ message: "Orders Not found For User" });
        }
        return res.status(200).json({
            message: "Order Founded Successfully",
            orders,
        });
    }
    catch(error){
       console.error(error);
        return res.status(401).json({ message: "No such Orders available" });
    }
  })

  orderRoute.get("/:orderId", authenticateToken, async(req, res)=>{
    try{ 
        const orderId = req.params.orderId;
        // console.log("inside fetch one order page " , orderId)
        const order = await Order.findOne({order_id : orderId})
        // console.log("order", order)
        if (!order) {
            return res.status(404).json({ message: "Orders Not found with OrderId :" });
        }
        return res.status(200).json({
            message: "Order Founded Successfully",
            order,
        });
    }
    catch(error){
       console.error(error);
        return res.status(401).json({ message: "No such Orders available" });
    }
  })

  module.exports = orderRoute;