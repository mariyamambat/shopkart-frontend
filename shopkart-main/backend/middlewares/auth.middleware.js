import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";
//to decide whether to let the request continue.
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //security check

    const customer = await Customer.findById(decoded.id).select("-password");

    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = customer;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;