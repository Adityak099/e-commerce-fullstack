import pool from "../../config/config.pgdb.js";
import * as cartService from "../cart/cart.service.js";
import OrderSnapshotSchema from "./order.model.js";

/**
 * 1. Create Pending Order
 * Saves to Postgres and Mongo, but keeps status as 'PENDING'
 */
export const createPendingOrder = async (userId, shippingAddress) => {
  // Fetch the live cart from Redis
  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) {
    throw new Error("Cannot checkout with an empty cart.");
  }

  // A street/city/zip string for the Postgres TEXT column
  const addressString = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.zipCode || ""}`;

  try {
    // Write to PostgreSQL (Financial Record)
    const pgQuery = `
      INSERT INTO orders (user_id, total_price, status, shipping_address)
      VALUES ($1, $2, $3, $4)
      RETURNING id, total_price;
    `;
    const pgValues = [userId, cart.totalPrice, "PENDING", addressString];
    const pgResult = await pool.query(pgQuery, pgValues);
    const pgOrderId = pgResult.rows[0].id;

    // Write to MongoDB (Itemized Snapshot)
    await OrderSnapshotSchema.create({
      pgOrderId: pgOrderId,
      userId: userId,
      items: cart.items, // This saves exactly what was in Redis at this moment
      shippingAddress: shippingAddress,
    });

    return {
      pgOrderId,
      totalPrice: cart.totalPrice,
    };
  } catch (error) {
    console.error("Error in createPendingOrder Service:", error);
    throw error;
  }
};

export const attachRazorpayOrderId = async (orderId, razorpayOrderId) => {
  const query = `
    UPDATE orders
    SET razorpay_order_id = $1
    WHERE id = $2
    RETURNING id;
  `;
  const result = await pool.query(query, [razorpayOrderId, orderId]);

  if (result.rowCount === 0) {
    throw new Error("Order not found while saving Razorpay order id.");
  }

  return result.rows[0];
};

/**
 * 2. Finalize Order
 * Called only after Razorpay signature is verified
 */
export const finalizeOrder = async (razorpayOrderId, razorpayPaymentId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Update Order Status in PostgreSQL
    const updateQuery = `
      UPDATE orders 
      SET status = 'COMPLETED', payment_id = $1 
      WHERE razorpay_order_id = $2
      RETURNING *;
    `;
    const result = await client.query(updateQuery, [
      razorpayPaymentId,
      razorpayOrderId,
    ]);

    if (result.rowCount === 0) {
      throw new Error("Order not found for finalization.");
    }

    const userId = result.rows[0].user_id;

    // 2. Clear the Redis Cart (Order is paid, cart no longer needed)
    await cartService.clearCart(userId);

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error finalizing order:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 3. Fetch User Order History
 */
export const getUserOrderHistory = async (userId) => {
  const query = `
    SELECT id, total_price, status, razorpay_order_id, payment_id, created_at 
    FROM orders 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};
