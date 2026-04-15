import dotenv from "dotenv";
import express, { json } from "express";
import pool from "./src/config/config.pgdb.js";
import connectDB from "./src/config/config.mongodb.js";
import authRoutes from "./src/modules/auth/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());
// Mount the auth module routes
app.use("/api/auth", authRoutes);

// Basic route to test if the server is running
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.get("/register", (req, res) => {
  res.json({ message: "This is the registration endpoint. Use POST /api/auth/register to register a new user." });
});

// Test database connection
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
