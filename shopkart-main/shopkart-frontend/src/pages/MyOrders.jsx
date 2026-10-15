import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api";
import Navbar from "../components/Navbar";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
    } catch (err) {
      setError(err.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="products-content">
        <h2>My Orders</h2>

        {loading && <p>Loading your orders...</p>}

        {!loading && error && (
          <div>
            <p>{error}</p>
            <button onClick={loadOrders}>Try Again</button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-wishlist">
            <p>You have no orders yet 📦</p>
            <button onClick={() => navigate("/products")}>Start Shopping</button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-card-head">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="order-badge">{order.status}</span>
                </div>

                <div className="order-card-items">
                  {order.items.map((item) => (
                    <div key={item.product} className="order-card-item">
                      {item.image && <img src={item.image} alt={item.name} />}
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-card-foot">
                  <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                  <button onClick={() => navigate(`/order-success/${order._id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;