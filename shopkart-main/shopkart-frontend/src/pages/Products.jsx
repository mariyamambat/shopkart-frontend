import { useState, useEffect } from "react";
import { getAllProducts } from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getAllProducts({
          search: search || undefined,
          category: category || undefined,
        });
        setProducts(data.products);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);

  return (
    <div>
      <Navbar />
      <div className="products-content">
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />
        {loading && <p>Loading products...</p>}
        {!loading && error && <p>Something went wrong while loading products.</p>}
        {!loading && !error && products.length === 0 && <p>No products found.</p>}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;