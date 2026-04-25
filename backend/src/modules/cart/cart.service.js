import { ensureRedis } from "../../config/config.redis.js";

const CART_PREFIX = "cart:";
const CART_TTL = 60 * 60 * 24 * 7; // Cart expires in 7 days

const getRedisClient = async () => {
  const redisClient = await ensureRedis();

  if (!redisClient) {
    throw new Error("Cart storage is currently unavailable");
  }

  return redisClient;
};

// Get cart for a user
export const getCart = async (userId) => {
  const redisClient = await getRedisClient();
  const cartData = await redisClient.get(`${CART_PREFIX}${userId}`);
  return cartData ? JSON.parse(cartData) : { items: [], totalPrice: 0 };
};

// Add or update item in cart
export const addItemToCart = async (userId, product) => {
  const redisClient = await getRedisClient();
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
  await redisClient.setex(
    `${CART_PREFIX}${userId}`,
    CART_TTL,
    JSON.stringify(cart),
  );
  return cart;
};

// Remove a single item by its Product ID
export const removeItem = async (userId, productId) => {
  const redisClient = await getRedisClient();
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
  await redisClient.set(`${CART_PREFIX}${userId}`, JSON.stringify(cart), "EX", 86400);
  return cart;
};

// Completely wipe the cart (Used after Checkout)
export const clearCart = async (userId) => {
  const redisClient = await getRedisClient();
  await redisClient.del(`${CART_PREFIX}${userId}`);
  return { items: [], totalPrice: 0 };
};

//Merge carts (e.g., when a user logs in and has an existing cart in Redis)
export const mergeCarts = async (userId, sessionId) => {
  const redisClient = await getRedisClient();
  const guestKey = `cart:guest:${sessionId}`;
  const userKey = `cart:${userId}`;

  // 1. Fetch both carts from Redis
  const [guestCartRaw, userCartRaw] = await Promise.all([
    redisClient.get(guestKey),
    redisClient.get(userKey),
  ]);

  if (!guestCartRaw) return; // Nothing to merge

  const guestCart = JSON.parse(guestCartRaw);
  const userCart = userCartRaw
    ? JSON.parse(userCartRaw)
    : { items: [], totalPrice: 0 };

  // 2. Merge Logic: Combine items
  guestCart.items.forEach((guestItem) => {
    const existingItem = userCart.items.find(
      (item) => item.productId === guestItem.productId,
    );

    if (existingItem) {
      // If item exists in both, sum the quantities
      existingItem.quantity += guestItem.quantity;
    } else {
      // If unique to guest, add to user cart
      userCart.items.push(guestItem);
    }
  });

  // 3. Recalculate Total Price
  userCart.totalPrice = userCart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 4. Save merged cart to User Key and DELETE Guest Key
  await Promise.all([
    redisClient.set(userKey, JSON.stringify(userCart), "EX", 86400),
    redisClient.del(guestKey),
  ]);

  return userCart;
};

// Update quantity of an item in the cart
// Update specific item quantity
export const updateItemQuantity = async (userId, productId, quantity) => {
  const redisClient = await getRedisClient();
  const cart = await getCart(userId);

  const item = cart.items.find((item) => item.productId === productId);
  if (!item) {
    throw new Error("Item not found in cart");
  }

  // Update quantity (ensure it's a number)
  item.quantity = Number(quantity);

  // Recalculate total price for the whole cart
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Save back to Redis with 24h expiration
  await redisClient.set(`${CART_PREFIX}${userId}`, JSON.stringify(cart), "EX", 86400);
  return cart;
};
