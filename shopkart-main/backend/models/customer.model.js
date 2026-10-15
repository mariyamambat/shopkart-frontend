import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
  },
  wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId, //gives id of type obejctid (24 hex char string)
    ref: "product",
  }
  ],
  cart: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  }
],
}, { timestamps: true });

const Customer = mongoose.model("customer", customerSchema);

export default Customer;