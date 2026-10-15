import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/create-payment-order", authMiddleware, createPaymentOrder);
orderRouter.post("/verify-payment", authMiddleware, verifyPayment);
orderRouter.get("/", authMiddleware, getMyOrders);
orderRouter.get("/:id", authMiddleware, getOrderById);

export default orderRouter;