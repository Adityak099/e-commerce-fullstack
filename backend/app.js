import dotenv from "dotenv";
import express, { json } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());

// Basic route to test if the server is running
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
