import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/api";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="product-details-content">
        {loading && <p>Loading product...</p>}
        {!loading && error && <p>Something went wrong while loading this product.</p>}
        {!loading && !error && product && (
          <div className="product-details">
            <img src={product.image} alt={product.name} />
            <div className="product-details-info">
              <h2>{product.name}</h2>
              <p className="product-category">{product.category}</p>
              <p className="product-price">₹{product.price.toLocaleString("en-IN")}</p>
              <p>{product.description}</p>
              <p className="product-stock">
                {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
              </p>
              <button>Add to Cart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;