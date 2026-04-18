import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware.js";
import * as cartController from "./cart.controller.js";

const router = Router();

router.use(authenticateToken); // All cart routes require login

router.get("/", cartController.getMyCart);
router.post("/add", cartController.addToCart);
router.delete(
  "/remove/:productId",
  authenticateToken,
  cartController.removeFromCart,
);

// Clear the entire cart
router.delete("/clear", authenticateToken, async (req, res) => {
  await cartService.clearCart(req.user.userId);
  res.status(200).json({ success: true, message: "Cart cleared" });
});

export default router;
