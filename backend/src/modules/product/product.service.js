/*This file is the "brain" of your module. It handles the logic for slug generation, price formatting (converting to the Prisma-friendly Decimal type), and most importantly, the ownership check to keep your marketplace secure. */

import * as productRepo from "./product.repository.js";
import { Prisma } from "@prisma/client";

/**
 * PRODUCT SERVICE
 * Contains business logic: security checks, data formatting, and slug generation.
 */

// -- ADD PRODUCT --
export const addProduct = async (productData, sellerId) => {
  // 1. Generate a URL-friendly slug (e.g., "Makhana Pops" -> "makhana-pops-123456789")
  const slug =
    productData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with -
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now();

  // 2. Format data for Prisma
  const formattedData = {
    ...productData,
    slug,
    sellerId,
    // Ensure price is treated as a Decimal for accuracy
    price: new Prisma.Decimal(productData.price),
  };

  return await productRepo.createProduct(formattedData);
};

// -- LIST ALL PRODUCTS (Public) --
export const listAllProducts = async () => {
  return await productRepo.getAllProducts();
};

// -- GET SINGLE PRODUCT BY SLUG --
export const getProductBySlug = async (slug) => {
  return await productRepo.getProductBySlug(slug);
};

// -- GET PRODUCTS BY SELLER --
export const getProductsBySeller = async (sellerId) => {
  return await productRepo.getProductsBySellerId(sellerId);
};

// -- LIST ALL PRODUCTS (Admin Dashboard) --
export const listAllProductsForAdmin = async () => {
  return await productRepo.findManyProducts();
};

// -- UPDATE PRODUCT (With Ownership Check) --
export const updateProduct = async (productId, userId, role, updateData) => {
  // 1. Check if product exists and who owns it
  const product = await productRepo.getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // 2. Security: Only owner (Seller) or Admin can update
  if (product.sellerId !== userId && role !== "ADMIN") {
    throw new Error("Unauthorized: You do not own this product");
  }

  // 3. Format price if it's being updated
  if (updateData.price) {
    updateData.price = new Prisma.Decimal(updateData.price);
  }

  return await productRepo.updateProduct(productId, updateData);
};

// -- DELETE PRODUCT (With Ownership Check) --
export const deleteProduct = async (productId, userId, role) => {
  // 1. Check if product exists
  const product = await productRepo.getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // 2. Security: Only owner (Seller) or Admin can delete
  if (product.sellerId !== userId && role !== "ADMIN") {
    throw new Error(
      "Unauthorized: You do not have permission to delete this product",
    );
  }

  return await productRepo.deleteProduct(productId);
};
