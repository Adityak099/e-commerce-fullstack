import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware.js";
import * as orderController from "../orders/order.controller.js";

const router = Router();
router.post("/checkout", authenticateToken, orderController.checkout);

export default router;
