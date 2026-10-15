import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/:productId", authMiddleware, addToWishlist);
wishlistRouter.get("/", authMiddleware, getWishlist);
wishlistRouter.delete("/:productId", authMiddleware, removeFromWishlist);

export default wishlistRouter;