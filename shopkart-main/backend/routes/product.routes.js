import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import upload from "../middlewares/upload.middleware.js";

const productRouter = express.Router();

productRouter.post("/", upload.single("image"), createProduct);
productRouter.put("/:id", upload.single("image"), updateProduct);
productRouter.patch("/:id", upload.single("image"), updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

export default productRouter;