import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware.js";
import * as cartController from "./cart.controller.js";

const router = Router();

// Apply middleware to all routes in this file
router.use(authenticateToken);

// 1. GET /api/cart - Get current cart
router.get("/", cartController.getMyCart);

// 2. POST /api/cart/items - Add item (Renamed from /add)
router.post("/items", cartController.addToCart);

// 3. PUT /api/cart/items/:productId - UPDATE quantity (NEWLY ADDED)
router.put("/items/:productId", cartController.updateQuantity);

// 4. DELETE /api/cart/items/:productId - Remove item (Renamed from /remove)
router.delete("/items/:productId", cartController.removeFromCart);

// 5. DELETE /api/cart - Clear entire cart (Logic moved to controller)
router.delete("/", cartController.clearCart);

// 6. POST /api/cart/merge - Merge guest cart
router.post("/merge", cartController.handleMerge);

export default router;
