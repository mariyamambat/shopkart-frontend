import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customer = req.user;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      existingItem.quantity += 1;
    } else {
      if (product.stock < 1) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: customer.cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server crashed", error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock",
    });

    res.status(200).json({
      success: true,
      cart: customer.cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server crashed", error: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const customer = req.user;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const item = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Quantity exceeds available stock" });
    }

    item.quantity = quantity;
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: customer.cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server crashed", error: error.message });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customer = req.user;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: customer.cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server crashed", error: error.message });
  }
};