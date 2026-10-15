import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createPaymentOrder, verifyPayment } from "../services/api";
import Navbar from "../components/Navbar";

const emptyForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

const fields = [
  ["fullName", "Full Name"],
  ["phone", "Phone"],
  ["addressLine1", "Address"],
  ["city", "City"],
  ["state", "State"],
  ["pincode", "Pincode"],
];

function Checkout() {
  const { items, subtotal, loading, fetchCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const validItems = items.filter((item) => item.product);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Returns the trimmed copy of the form and any error messages
  const validate = () => {
    const cleaned = {};
    Object.keys(form).forEach((key) => {
      cleaned[key] = form[key].trim();
    });

    const newErrors = {};
    if (!cleaned.fullName) newErrors.fullName = "Full name is required.";
    if (!/^[0-9]{10}$/.test(cleaned.phone))
      newErrors.phone = "Phone must be exactly 10 digits.";
    if (!cleaned.addressLine1) newErrors.addressLine1 = "Address is required.";
    if (!cleaned.city) newErrors.city = "City is required.";
    if (!cleaned.state) newErrors.state = "State is required.";
    if (!/^[0-9]{6}$/.test(cleaned.pincode))
      newErrors.pincode = "Pincode must be exactly 6 digits.";

    return { cleaned, newErrors };
  };

  const openRazorpay = (checkoutData, cleaned) => {
    const options = {
      key: checkoutData.keyId,
      amount: checkoutData.amount,
      currency: checkoutData.currency,
      name: "ShopKart",
      description: "Order payment",
      order_id: checkoutData.razorpayOrderId,
      prefill: { name: cleaned.fullName, contact: cleaned.phone },

      // Runs only when the payment succeeds inside the popup
      handler: async (response) => {
        try {
          await verifyPayment({
            orderId: checkoutData.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          clearCart(); // empties the frontend cart so Navbar shows Cart (0)
          navigate(`/order-success/${checkoutData.orderId}`);
        } catch (err) {
          setPayError(err.message || "Payment verification failed.");
          setSubmitting(false);
        }
      },

      // Runs if the user closes the popup without paying
      modal: {
        ondismiss: () => {
          setPayError("Payment was cancelled. Your cart is still saved.");
          setSubmitting(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", () => {
      setPayError("Payment failed. Please try again.");
      setSubmitting(false);
    });

    razorpay.open();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPayError("");

    const { cleaned, newErrors } = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // no backend call

    setSubmitting(true);
    try {
      const checkoutData = await createPaymentOrder(cleaned);
      openRazorpay(checkoutData, cleaned);
    } catch (err) {
      setPayError(err.message || "Could not start payment.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="products-content">
        <h2>Checkout</h2>

        {loading && <p>Loading checkout...</p>}

        {!loading && validItems.length === 0 && (
          <div className="empty-wishlist">
            <p>Your cart is empty.</p>
            <button onClick={() => navigate("/products")}>Browse Products</button>
          </div>
        )}

        {!loading && validItems.length > 0 && (
          <div className="checkout-page">
            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <h3>Shipping Address</h3>
              {fields.map(([name, label]) => (
                <div key={name} className="checkout-field">
                  <label htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    maxLength={
                      name === "phone" ? 10 : name === "pincode" ? 6 : undefined
                    }
                  />
                  {errors[name] && <p className="checkout-error">{errors[name]}</p>}
                </div>
              ))}
              {payError && <p className="checkout-error">{payError}</p>}
              <button type="submit" disabled={submitting}>
                {submitting ? "Processing..." : "Pay Now"}
              </button>
            </form>

            <div className="order-summary">
              <h3>Order Summary</h3>
              {validItems.map((item) => (
                <div key={item.product._id} className="checkout-line">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <hr />
              <div className="checkout-line">
                <strong>Total</strong>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;