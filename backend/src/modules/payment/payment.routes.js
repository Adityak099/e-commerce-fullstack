import express from "express";
import { verifyPayment } from "./payment.controller.js";

const router = express.Router();

// This will be accessible at POST /api/payment/verify
router.post("/verify", verifyPayment);

export default router;
