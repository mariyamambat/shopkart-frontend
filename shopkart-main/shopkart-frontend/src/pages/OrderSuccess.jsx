import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/api";
import Navbar from "../components/Navbar";

function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (err) {
        setError(err.message || "Could not load your order.");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const isPaid = order && order.paymentStatus === "PAID";

  return (
    <div>
      <Navbar />
      <div className="products-content">
        {loading && <p>Loading your order...</p>}

        {!loading && error && (
          <div className="empty-wishlist">
            <p>{error}</p>
            <button onClick={() => navigate("/products")}>Browse Products</button>
          </div>
        )}

        {!loading && order && (
          <div className="success-card">
            <h2>{isPaid ? "Order placed successfully 🎉" : "Payment not confirmed yet"}</h2>
            <p className="success-sub">
              {isPaid
                ? "Thank you for shopping with ShopKart. We have received your payment."
                : "We could not confirm the payment for this order."}
            </p>

            <div className="success-meta">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Placed on:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
              <p>
                <strong>Order status:</strong> {order.status}
              </p>
              <p>
                <strong>Payment status:</strong> {order.paymentStatus}
              </p>
              {order.razorpayPaymentId && (
                <p>
                  <strong>Payment ID:</strong> {order.razorpayPaymentId}
                </p>
              )}
            </div>

            <h3>Items</h3>
            {order.items.map((item) => (
              <div key={item.product} className="checkout-line">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <hr />
            <div className="checkout-line">
              <strong>Total paid</strong>
              <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
            </div>

            <h3>Shipping to</h3>
            <p>
              {order.shippingAddress.fullName}, {order.shippingAddress.phone}
              <br />
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>

            <div className="success-actions">
              <button onClick={() => navigate("/products")}>Continue Shopping</button>
              <button onClick={() => navigate("/orders")}>View My Orders</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderSuccess;