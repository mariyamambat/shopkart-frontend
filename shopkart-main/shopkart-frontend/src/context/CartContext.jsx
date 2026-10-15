import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial load: shows the loading state
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCart();
      setItems(data.cart);
    } catch (err) {
      setItems([]);
      if (err.message !== "Unauthorized") {
        setError(err.message || "Unable to load cart.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Quiet refresh after a change: no loading flash
  const refreshItems = async () => {
    const data = await getCart();
    setItems(data.cart);
  };

  const addItem = async (productId) => {
    setError("");
    try {
      await addToCart(productId);
      await refreshItems();
    } catch (err) {
      setError(err.message || "Unable to add to cart.");
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setError("");
    try {
      await updateCartQuantity(productId, quantity);
      await refreshItems();
    } catch (err) {
      setError(err.message || "Unable to update quantity.");
      throw err;
    }
  };

  const removeItem = async (productId) => {
    setError("");
    try {
      await removeFromCart(productId);
      await refreshItems();
    } catch (err) {
      setError(err.message || "Unable to remove item.");
      throw err;
    }
  };

  const clearCart = () => setItems([]);

  // Derived values: calculated from items, never stored anywhere
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + (item.product?.price ?? 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        cartCount,
        subtotal,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);