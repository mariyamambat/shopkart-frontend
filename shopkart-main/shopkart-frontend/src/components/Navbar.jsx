import { useNavigate, Link } from "react-router-dom";
import { logoutCustomer } from "../services/api";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount, clearCart } = useCart();

  const handleLogout = async () => {
    await logoutCustomer();
    clearCart();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/home">ShopKart</Link>
      <Link to="/products">Products</Link>
      <Link to="/wishlist">Wishlist</Link>
      <Link to="/cart">Cart ({cartCount})</Link>
      <Link to="/orders">Orders</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;