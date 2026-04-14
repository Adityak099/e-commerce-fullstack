import dotenv from "dotenv";
import express, { json } from "express";
import pool from "./src/config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());

// Basic route to test if the server is running
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Test database connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected!",
      timestamp: result.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
