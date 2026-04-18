import { nanoid } from "nanoid";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
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
  // Only generate a slug if it's a new document OR the name changed
  // AND we don't already have a slug we want to keep
  if (this.isModified("name") && !this.isModified("slug")) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${nanoid(6)}`; // Generates a tiny, unique 6-character ID (nanoid) and appends it to the slugified name to ensure uniqueness
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
