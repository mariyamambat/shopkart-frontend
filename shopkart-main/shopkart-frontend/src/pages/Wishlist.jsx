import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/api";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getWishlist();
      setProducts(data.wishlist);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert("Could not remove product. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="products-content">
        <h2>My Wishlist</h2>

        {loading && <p>Loading your wishlist...</p>}

        {!loading && error && (
          <div>
            <p>Something went wrong. We couldn't load your wishlist.</p>
            <button onClick={fetchWishlist}>Try Again</button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="empty-wishlist">
            <p>❤️</p>
            <p>Your wishlist is empty</p>
            <p>Save products you love and find them here later.</p>
            <button onClick={() => navigate("/products")}>Browse Products</button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <p>{products.length} products saved</p>
            <div className="product-grid">
              {products.map((product) => (
                <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlist;