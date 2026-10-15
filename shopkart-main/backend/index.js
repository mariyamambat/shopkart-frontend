import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import customerRouter from "./routes/customer.routes.js";
import productRouter from "./routes/product.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());       // parses incoming JSON request bodies into req.body
app.use(cookieParser());       // parses cookies into req.cookies
app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/wishlist", wishlistRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});