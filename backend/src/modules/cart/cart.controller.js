import * as cartService from "./cart.service.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, quantity, image } = req.body;
    const userId = req.user.userId;

    const updatedCart = await cartService.addItemToCart(userId, {
      productId,
      name,
      price,
      quantity: quantity || 1,
      image,
    });

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get the current cart for the user
export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Clear the entire cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params; // We'll pass the ID in the URL

    const updatedCart = await cartService.removeItem(userId, productId);
    
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart
    });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};