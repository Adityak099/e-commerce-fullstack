import * as orderService from "./order.service.js";

export const checkout = async (req, res) => {
  try {
    // 1. Get userId from the authenticated token (provided by middleware)
    const userId = req.user.userId;

    // 2. Get shipping details from the request body
    const { shippingAddress } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        error:
          "Please provide a complete shipping address (street, city, zipCode).",
      });
    }

    // 3. Execute the multi-DB order logic
    const result = await orderService.placeOrder(userId, shippingAddress);

    // 4. Return success
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: result.pgOrderId,
      amountPaid: result.totalPrice,
    });
  } catch (error) {
    console.error("Checkout Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during checkout.",
    });
  }
};
