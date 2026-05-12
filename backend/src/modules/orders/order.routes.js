import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware.js";
import * as orderController from "../orders/order.controller.js";

const router = Router();
router.post("/checkout", authenticateToken, orderController.checkout);
router.get("/history", authenticateToken, orderController.getOrderHistory);
router.get("/my-orders", authenticateToken, orderController.getOrderHistory);
router.get("/:id", authenticateToken, orderController.getOrderById);

export default router;
