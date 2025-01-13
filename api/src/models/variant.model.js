import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    attributes: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    price: {
      type: Number,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      min: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

variantSchema.index({ product: 1 });

export const Variant = mongoose.model("Variant", variantSchema);
