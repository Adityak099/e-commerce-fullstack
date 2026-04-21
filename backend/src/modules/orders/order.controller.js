import * as orderService from "./order.service.js";
import { razorpay } from "../../config/config.razorpay.js";

// This controller handles the checkout process, which includes:
// 1. Validating the shipping address.
// 2. Creating a "PENDING" order in Postgres and a snapshot in MongoDB.
// 3. Initializing a Razorpay order and returning the necessary details to the frontend.
/**
 * STEP 1: Initialize Checkout
 * Creates internal orders and prepares Razorpay payment
 */
export const checkout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    // 1. Validation
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        error: "Please provide a complete shipping address.",
      });
    }

    // 2. Create internal order records (PostgreSQL + MongoDB)
    // IMPORTANT: This service function should now set the status to 'PENDING'
    const result = await orderService.createPendingOrder(
      userId,
      shippingAddress,
    );

    // 3. Create Razorpay Order
    const options = {
      amount: Math.round(result.totalPrice * 100), // Amount in paise (899.00 -> 89900)
      currency: "INR",
      receipt: `order_${result.pgOrderId.slice(0, 30)}`,
    };

    console.log("--- LIVE CHECKOUT AUTH CHECK ---");
    console.log("Key being used:", razorpay.key_id);
    console.log("Secret length being used:", razorpay.key_secret?.length);
    console.log("Sending to Razorpay:", options); // DEBUG LOG 1

    const rzpOrder = await razorpay.orders.create(options);
    await orderService.attachRazorpayOrderId(result.pgOrderId, rzpOrder.id);

    // 4. Return all data to Frontend
    // The frontend will use rzpOrderId to open the Razorpay Modal
    res.status(201).json({
      success: true,
      message: "Payment initialized",
      data: {
        internalOrderId: result.pgOrderId,
        rzpOrderId: rzpOrder.id,
        amount: options.amount,
        currency: options.currency,
        key: process.env.RAZORPAY_KEY_ID, // Public key for frontend
      },
    });
  } catch (error) {
    console.error("FULL ERROR OBJECT:", error); // DEBUG LOG 2
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during checkout.",
    });
  }
};



//Getting Order History of a user
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await orderService.getUserOrderHistory(userId);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
