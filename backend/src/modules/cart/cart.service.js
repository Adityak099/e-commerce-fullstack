import { redisClient } from "../../config/config.redis.js";

const CART_PREFIX = "cart:";
const CART_TTL = 60 * 60 * 24 * 7; // Cart expires in 7 days

export const getCart = async (userId) => {
  const cartData = await redisClient.get(`${CART_PREFIX}${userId}`);
  return cartData ? JSON.parse(cartData) : { items: [], totalPrice: 0 };
};

export const addItemToCart = async (userId, product) => {
  const cart = await getCart(userId);

  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId === product.productId,
  );

  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += product.quantity;
  } else {
    // Add new item
    cart.items.push(product);
  }

  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Save to Redis with Expiry
  await redisClient.setEx(
    `${CART_PREFIX}${userId}`,
    CART_TTL,
    JSON.stringify(cart),
  );
  return cart;
};

export const clearCart = async (userId) => {
  await redisClient.del(`${CART_PREFIX}${userId}`);
  return { items: [], totalPrice: 0 };
};
