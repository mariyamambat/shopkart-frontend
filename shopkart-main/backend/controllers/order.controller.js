import crypto from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";

// Created inside a function on purpose. ES imports run BEFORE dotenv.config()
// in index.js, so reading process.env at the top of this file would give undefined.
const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const validateShippingAddress = (address) => {
  if (!address || typeof address !== "object") return "Shipping address is required.";

  const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
  for (const field of required) {
    if (typeof address[field] !== "string" || !address[field].trim()) {
      return `${field} is required.`;
    }
  }
  if (!/^[0-9]{10}$/.test(address.phone.trim())) return "Phone must be exactly 10 digits.";
  if (!/^[0-9]{6}$/.test(address.pincode.trim())) return "Pincode must be exactly 6 digits.";
  return null;
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // 1. Validate address
    const addressError = validateShippingAddress(shippingAddress);
    if (addressError) {
      return res.status(400).json({ message: addressError });
    }

    // 2. Load the latest cart with the latest product data
    const customer = await Customer.findById(req.user._id).populate("cart.product");

    // 3. Empty cart
    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // 4 and 5. Check stock, build snapshot, calculate total on the server
    const orderItems = [];
    let totalAmount = 0;

    for (const row of customer.cart) {
      const product = row.product;

      if (!product) {
        return res
          .status(400)
          .json({ message: "A product in your cart is no longer available." });
      }
      if (product.stock < row.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}.` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: row.quantity,
        image: product.image,
      });
      totalAmount += product.price * row.quantity;
    }

    // Remove floating point noise (e.g. 6244.000000001)
    totalAmount = Math.round(totalAmount * 100) / 100;

    // Trim the address values before saving
    const cleanAddress = {};
    for (const key of Object.keys(shippingAddress)) {
      if (typeof shippingAddress[key] === "string") {
        cleanAddress[key] = shippingAddress[key].trim();
      }
    }

    // 6. Save a pending order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: cleanAddress.fullName,
        phone: cleanAddress.phone,
        addressLine1: cleanAddress.addressLine1,
        city: cleanAddress.city,
        state: cleanAddress.state,
        pincode: cleanAddress.pincode,
      },
      totalAmount,
    });

    // 7. Create the Razorpay order (amount is in paise)
    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    // 8. Save the Razorpay order id and return checkout data
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create payment order", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details." });
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    // Only the owner's order can be verified
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Already verified before: do nothing again
    if (order.paymentStatus === "PAID") {
      return res.status(200).json({ message: "Payment already verified.", orderId: order._id });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: "Razorpay order does not match this order." });
    }

    // Recompute the signature using our secret key
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid =
      typeof razorpay_signature === "string" &&
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

    if (!isValid) {
      order.paymentStatus = "FAILED";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed." });
    }

    // Signature is valid: reduce stock (only if enough is still available)
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Clear the cart only now, after verified payment
    await Customer.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(200).json({ message: "Payment verified. Order placed.", orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: "Could not verify payment", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    // Only paid orders, so abandoned PENDING ones do not clutter the list
    const orders = await Order.find({ user: req.user._id, paymentStatus: "PAID" }).sort({
      createdAt: -1,
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch orders", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    // Filter by user too, so nobody can read someone else's order
    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch order", error: error.message });
  }
};