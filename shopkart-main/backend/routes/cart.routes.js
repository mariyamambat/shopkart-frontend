import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addToCart, getCart, updateCartQuantity, removeFromCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/:productId", authMiddleware, addToCart);
cartRouter.get("/", authMiddleware, getCart);
cartRouter.patch("/:productId", authMiddleware, updateCartQuantity);
cartRouter.delete("/:productId", authMiddleware, removeFromCart);

export default cartRouter;