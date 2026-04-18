import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: String,
    images: [String],
    sellerId: { type: String, required: true }, // Links back to Postgres User ID
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
