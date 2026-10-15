import { useNavigate } from "react-router-dom";

function WishlistCard({ product, onRemove }) {
  const navigate = useNavigate();

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
      <button onClick={() => onRemove(product._id)}>Remove ♥</button>
    </div>
  );
}

export default WishlistCard;