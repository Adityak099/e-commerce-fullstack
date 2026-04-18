import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../modules/product/product.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ MongoDB connected successfully");

    await Product.syncIndexes();
    console.log("✓ Product indexes synchronized");
  } catch (error) {
    console.error(
      "✗ Failed to connect to MongoDB, MongoDB connection error:",
      error,
    );
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
