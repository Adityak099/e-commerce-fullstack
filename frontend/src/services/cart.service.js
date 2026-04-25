import api from "@/lib/api";

const CART_EVENT = "cart-change";

const emitCartChange = (cart) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: cart }));
  }
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data?.data || { items: [], totalPrice: 0 };
};

export const addToCart = async ({ productId, name, price, quantity, image }) => {
  const response = await api.post("/cart/items", {
    productId,
    name,
    price,
    quantity,
    image,
  });

  const cart = response.data?.data || { items: [], totalPrice: 0 };
  emitCartChange(cart);
  return cart;
};

export const updateCartItemQuantity = async (productId, quantity) => {
  const response = await api.put(`/cart/items/${productId}`, { quantity });
  const cart = response.data?.data || { items: [], totalPrice: 0 };
  emitCartChange(cart);
  return cart;
};

export const removeCartItem = async (productId) => {
  const response = await api.delete(`/cart/items/${productId}`);
  const cart = response.data?.data || { items: [], totalPrice: 0 };
  emitCartChange(cart);
  return cart;
};

export const subscribeToCartChanges = (listener) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event) => {
    listener(event.detail);
  };

  window.addEventListener(CART_EVENT, handler);
  return () => window.removeEventListener(CART_EVENT, handler);
};

export const formatCartPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
