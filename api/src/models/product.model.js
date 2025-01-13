import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      short: { type: String, required: true },
      detailed: { type: String },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    brand: {
      type: String,
      default: "No brand",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ name: "text" });
productSchema.index({ slug: 1 });

export const Product = mongoose.model("Product", productSchema);
