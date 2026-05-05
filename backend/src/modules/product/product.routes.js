import express from "express";
import * as controller from "./product.controller.js";
import { authenticateToken } from "../auth/auth.middleware.js";
import { authorize } from "../../middleware/rbac.middleware.js"; // Import our new factory
import { validateProduct } from "./product.validators.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", controller.getAllProducts);
router.get("/search", controller.searchProducts);

// --- SELLER & ADMIN ROUTES (Get my products must come before /:slug) ---
router.get(
  "/my-products",
  authenticateToken,
  authorize("SELLER"),
  controller.getSellerProducts,
);

// --- PUBLIC ROUTES (Dynamic routes last) ---
router.get("/:slug", controller.getProductBySlug);

// --- SELLER & ADMIN ROUTES (Creation & Management) ---
// Note: We use authorize('SELLER', 'ADMIN') for things both can do
router.post(
  "/",
  authenticateToken,
  authorize("SELLER", "ADMIN"),
  validateProduct,
  controller.createNewProduct,
);

// --- OWNERSHIP PROTECTED ROUTES ---
// We allow both roles here, but the Service layer will check if
// the SELLER actually owns the specific ID they are trying to edit.
router.patch(
  "/:id",
  authenticateToken,
  authorize("SELLER", "ADMIN"),
  controller.updateProduct,
);

router.delete(
  "/:id",
  authenticateToken,
  authorize("SELLER", "ADMIN"),
  controller.deleteProduct,
);

// --- STRICTLY ADMIN ROUTES ---
router.get(
  "/admin/all",
  authenticateToken,
  authorize("ADMIN"),
  controller.adminGetAll,
);

export default router;
