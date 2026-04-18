import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import express, { json } from "express";
import pool from "./src/config/config.pgdb.js";
import connectDB from "./src/config/config.mongodb.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import { connectRedis } from "./src/config/config.redis.js";
import cartRoutes from "./src/modules/cart/cart.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Redis
connectRedis(); // Connect to Redis when the app starts
// Connect to MongoDB
connectDB(); // Connect to MongoDB when the app starts

// Middleware
app.use(json());

// Mount the auth module routes
app.use("/api/auth", authRoutes);
// Mount the cart module routes
app.use("/api/cart", cartRoutes);

// Mount the product module routes
// Note: We use dynamic import here to avoid circular dependency issues since the product module might also import something from app.js in the future (like a logger or config).
app.use(
  "/api/products",
  (await import("./src/modules/product/product.routes.js")).default,
);

// Basic route to test if the server is running
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Test registration endpoint
app.get("/register", (req, res) => {
  res.json({
    message:
      "This is the registration endpoint. Use POST /api/auth/register to register a new user.",
  });
});

// Test database connection to PostgreSQL
app.get("/pgdb-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "PG Database connected!",
      timestamp: result.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Connect to MongoDB
connectDB();
app.get("/mongodb-test", async (req, res) => {
  try {
    // Just a simple test to check MongoDB connection
    res.json({ message: "MongoDB connection is successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Connect to Redis
// Test Redis Connection
app.get("/redis-test", async (req, res) => {
  try {
    const { redisClient } = await import("./src/config/config.redis.js");
    await redisClient.set("test_key", "Redis is working!");
    const value = await redisClient.get("test_key");
    res.json({
      message: "Redis connection is successful!",
      storedValue: value,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
