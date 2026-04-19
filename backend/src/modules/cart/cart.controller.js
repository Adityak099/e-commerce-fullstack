import * as cartService from "./cart.service.js";

/**
 * @desc    Add a product to the Redis-backed cart
 * @route   POST /api/cart/items
 * @access  Private
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, quantity, image } = req.body;
    const userId = req.user.userId; // Extracted from authenticateToken middleware

    // Call service to handle logic of finding existing items vs adding new ones
    const updatedCart = await cartService.addItemToCart(userId, {
      productId,
      name,
      price,
      quantity: quantity || 1,
      image,
    });

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Retrieve the current user's cart from Redis
 * @route   GET /api/cart
 * @access  Private
 */
export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update the quantity of a specific item (e.g., in the cart UI)
 * @route   PUT /api/cart/items/:productId
 * @access  Private
 */
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validation: prevent zero or negative quantities
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be at least 1. Use DELETE to remove the item.",
      });
    }

    const updatedCart = await cartService.updateItemQuantity(
      userId,
      productId,
      quantity,
    );

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: updatedCart,
    });
  } catch (error) {
    // 404 if the item doesn't exist in the cart to begin with
    res.status(404).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Remove one specific product from the cart
 * @route   DELETE /api/cart/items/:productId
 * @access  Private
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const updatedCart = await cartService.removeItem(userId, productId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: updatedCart,
    });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Wipe the entire cart (e.g., user wants to cancel or after checkout)
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await cartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Merge a guest/temporary cart into the logged-in user's cart
 * @route   POST /api/cart/merge
 * @access  Private
 */
export const handleMerge = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.body; // Sent from frontend storage (e.g. localStorage)

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Session ID is required to locate the guest cart.",
      });
    }

    const mergedCart = await cartService.mergeCarts(userId, sessionId);

    res.status(200).json({
      success: true,
      message: "Guest cart items merged into your account",
      data: mergedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc  Handle the checkout process: save order to PostgreSQL, clear cart, etc.
 * @route POST /api/cart/checkout
 * @access Private
 */
export const checkout = async (req, res) => {
  const userId = req.user.userId;

  try {
    // 1. Get cart from Redis
    const cart = await cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Save to PostgreSQL (Status & Total)
    const pgResult = await pool.query(
      "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING id",
      [userId, cart.totalPrice, "PENDING"],
    );
    const orderId = pgResult.rows[0].id;

    // 3. Save Detailed Order to MongoDB (Items list)
    // const orderDetail = await OrderModel.create({ orderId, userId, items: cart.items });

    // 4. Clear the Cart from Redis
    await cartService.clearCart(userId);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: orderId,
      amountPaid: cart.totalPrice,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
