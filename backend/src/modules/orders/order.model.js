import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  pgOrderId: { type: String, required: true, unique: true }, // Link to Postgres
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    zipCode: String,
  },
  orderedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
