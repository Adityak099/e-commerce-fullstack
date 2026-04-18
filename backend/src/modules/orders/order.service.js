import pool from "../../config/config.pgdb.js"; //Postgres connection pool
import Order from "./order.model.js"; // Order model (MoongoDB Model)
import * as cartService from "../cart/cart.service.js";
import Product from "../product/product.model.js"; // Product model to check stock (MongoDB Model)

export const placeOrder = async (userId, shippingAddress) => {
  // 1. Get the cart from Redis
  const cart = await cartService.getCart(userId);
  if (!cart.items.length) {
    throw new Error("Cart is empty");
  }

  // 2. Validate Stock in MongoDB
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product || product.inventory.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}`);
    }
  }

  // 3. CREATE RECORD IN POSTGRES (The Financial Record)
  const pgQuery = `
    INSERT INTO orders (user_id, total_price, status) 
    VALUES ($1, $2, $3) 
    RETURNING id
  `;
  const pgValues = [userId, cart.totalPrice, "COMPLETED"];
  const pgResult = await pool.query(pgQuery, pgValues);
  const pgOrderId = pgResult.rows[0].id;

  // 4. CREATE RECORD IN MONGODB (The Item Snapshot)
  const mongoOrder = new Order({
    pgOrderId: pgOrderId,
    userId: userId,
    items: cart.items,
    shippingAddress,
  });
  await mongoOrder.save();

  // 5. REDUCE STOCK IN MONGODB
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { "inventory.stock": -item.quantity },
    });
  }

  // 6. CLEAR CART IN REDIS
  await cartService.clearCart(userId);

  return { pgOrderId, totalPrice: cart.totalPrice };
};
