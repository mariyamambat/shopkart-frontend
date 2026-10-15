import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToWishlist } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { items, addItem } = useCart();
  const [wishlistState, setWishlistState] = useState("default");
  const [cartState, setCartState] = useState("default");
  const [cartError, setCartError] = useState("");

  // true if this product already has a row in the shared cart
  const inCart = items.some((item) => item.product?._id === product._id);

  const handleAddToWishlist = async () => {

    //prevent duplicate requests
    if (wishlistState === "saving" || wishlistState === "success") return;

    setWishlistState("saving");
    try {
      await addToWishlist(product._id);
      setWishlistState("success");
    } catch (err) {
      setWishlistState("error");
    }
  };

  const handleAddToCart = async () => {
    if (cartState === "adding") return;

    setCartState("adding");
    setCartError("");
    try {
      await addItem(product._id);
    } catch (err) {
      setCartError(err.message || "Could not add to cart.");
    } finally {
      setCartState("default");
    }
  };

  const wishlistLabel = {
    default: "♡ Add to Wishlist",
    saving: "⏳ Saving...",
    success: "♥ Added to Wishlist",
    error: "Unable to save. Try again.",
  }[wishlistState];

  const cartLabel =
    cartState === "adding" ? "Adding..." : inCart ? "Add Another" : "Add to Cart";

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">₹{product.price.toLocaleString("en-IN")}</p>
      <p className="product-stock">
        {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
      </p>
      <button onClick={() => navigate(`/products/${product._id}`)}>
        View Details
      </button>
      <button onClick={handleAddToWishlist} disabled={wishlistState === "saving"}>
        {wishlistLabel}
      </button>
      <button
        onClick={handleAddToCart}
        disabled={cartState === "adding" || product.stock < 1}
      >
        {cartLabel}
      </button>
      {cartError && <p className="cart-error">{cartError}</p>}
    </div>
  );
}

export default ProductCard;