import { redisClient } from "../../config/config.redis.js";

const CART_PREFIX = "cart:";
const CART_TTL = 60 * 60 * 24 * 7; // Cart expires in 7 days

export const getCart = async (userId) => {
  const cartData = await redisClient.get(`${CART_PREFIX}${userId}`);
  return cartData ? JSON.parse(cartData) : { items: [], totalPrice: 0 };
};

// Add or update item in cart
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

//Remove item from cart
// Remove a single item by its Product ID
export const removeItem = async (userId, productId) => {
  const cart = await getCart(userId);

  // Filter out the item we want to delete
  const initialCount = cart.items.length;
  cart.items = cart.items.filter((item) => item.productId !== productId);

  if (cart.items.length === initialCount) {
    throw new Error("Item not found in cart");
  }

  // Recalculate total price after removal
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Save the updated cart back to Redis
  await redisClient.set(`cart:${userId}`, JSON.stringify(cart), { EX: 86400 });
  return cart;
};

// Completely wipe the cart (Used after Checkout)
export const clearCart = async (userId) => {
  await redisClient.del(`cart:${userId}`);
  return { items: [], totalPrice: 0 };
};
