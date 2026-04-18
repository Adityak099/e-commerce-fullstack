import mongoose from "mongoose";
import { nanoid } from "nanoid";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    seller: {
      type: String, // This is our Postgres UUID from the Handshake!
      required: true,
    },
    inventory: {
      stock: { type: Number, default: 0 },
      lowStockThreshold: { type: Number, default: 10 },
    },
    specifications: {
      flavor: String,
      weight: String,
      shelfLife: String,
    },
    images: [{ url: String, public_id: String }],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  // Logic fix: generate slug if it's a new name or slug doesn't exist yet
  if (this.isModified("name") || !this.slug) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${nanoid(6)}`;
  } // Generates a tiny, unique 6-character ID (nanoid) and appends it to the slugified name to ensure uniqueness
1});

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});

const Product = mongoose.model("Product", productSchema);
export default Product;
