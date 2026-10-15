import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getProfile,
  logoutCustomer,
} from "../controllers/customer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const customerRouter = express.Router();

customerRouter.post("/register", registerCustomer);
customerRouter.post("/login", loginCustomer);
customerRouter.get("/me", authMiddleware, getProfile);
customerRouter.post("/logout", authMiddleware, logoutCustomer);

export default customerRouter;