import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/customers",
  withCredentials: true,
});

export const registerCustomer = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginCustomer = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCurrentCustomer = async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutCustomer = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const productApi = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const getAllProducts = async (params) => {
  try {
    const response = await productApi.get("/products", { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default api;

export const addToWishlist = async (productId) => {
  try {
    const response = await productApi.post(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await productApi.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWishlist = async () => {
  try {
    const response = await productApi.get("/wishlist");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addToCart = async (productId) => {
  try {
    const response = await productApi.post(`/cart/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCart = async () => {
  try {
    const response = await productApi.get("/cart");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await productApi.patch(`/cart/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await productApi.delete(`/cart/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createPaymentOrder = async (shippingAddress) => {
  try {
    const response = await productApi.post("/orders/create-payment-order", {
      shippingAddress,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await productApi.post("/orders/verify-payment", paymentData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export const getMyOrders = async () => {
  try {
    const response = await productApi.get("/orders");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await productApi.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};