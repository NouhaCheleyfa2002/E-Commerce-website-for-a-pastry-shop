// routes/orderRoutes.js

import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Fetch all orders
orderRouter.get("/orders", getAllOrders);

// Fetch an order by ID
orderRouter.get("/order/:id", getOrderById);

// Update order status
orderRouter.put("/order/:id", updateOrderStatus);

// Delete an order
orderRouter.delete("/order/:id", deleteOrder);

export default orderRouter;
