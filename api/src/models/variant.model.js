import mongoose from "mongoose";
import { generateSKU } from "../utils/generateSKU.util.js";
import { logger } from "../utils/logger.util.js";
import { customError } from "../utils/error.util.js";

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
    },
    attributes: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
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
      default: 0,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

variantSchema.index({ product: 1 });

variantSchema.pre("save", async function (next) {
  try {
    const session = this.$session();
    const product = await mongoose
      .model("Product")
      .findById(this.product)
      .session(session);

    if (!product) {
      const error = customError(
        404,
        "Associated product not found for the variant"
      );
      logger.error("Product error: ", error);
      return next(error);
    }

    this.sku = generateSKU(product.slug, this.attributes);
    next();
  } catch (error) {
    logger.error("Error generating SKU: ", error);
    next(error);
  }
});

export const Variant = mongoose.model("Variant", variantSchema);
