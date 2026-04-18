import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware.js";
import * as cartController from "./cart.controller.js";

const router = Router();

router.use(authenticateToken); // All cart routes require login

router.get("/", cartController.getMyCart);
router.post("/add", cartController.addToCart);

export default router;
