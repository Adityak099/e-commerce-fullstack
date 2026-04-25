import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import cors from "cors";

// Configurations
import pool from "./src/config/config.pgdb.js";
import connectDB from "./src/config/config.mongodb.js";
import { ensureRedis, redisClient } from "./src/config/config.redis.js";

// Routes
import authRoutes from "./src/modules/auth/auth.routes.js";
import cartRoutes from "./src/modules/cart/cart.routes.js";
import orderRoutes from "./src/modules/orders/order.routes.js";
import paymentRoutes from "./src/modules/payment/payment.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Initialize Database Connections
connectDB(); // Connect to MongoDB
ensureRedis();

// 2. Global Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(json());

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Dynamic import for Product routes
app.use(
  "/api/products",
  (await import("./src/modules/product/product.routes.js")).default,
);

// 4. Health Check & Test Endpoints
app.get("/", (req, res) => {
  res.json({ message: "FreshMart Backend is running!" });
});

// PostgreSQL Test
app.get("/pgdb-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Supabase PG connected!", timestamp: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MongoDB Test
app.get("/mongodb-test", async (req, res) => {
  res.json({ message: "MongoDB Cloud connection is active!" });
});

// Redis Test (Upstash)
app.get("/redis-test", async (req, res) => {
  try {
    await redisClient.set("test_key", "Upstash Cloud is working!");
    const value = await redisClient.get("test_key");
    res.json({ message: "Redis Cloud success!", storedValue: value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Postgres: Supabase | 🍃 Mongo: Atlas | ⚡ Redis: Upstash`);
});
