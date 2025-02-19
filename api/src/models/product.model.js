import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.util.js";
import { logger } from "../utils/logger.util.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
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
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    brand: {
      type: String,
      default: "No brand",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  let generatedSlug = generateSlug(this.name);

  try {
    const exists = await mongoose
      .model("Product")
      .findOne({ slug: generatedSlug, _id: { $ne: this._id } });

    if (exists) generatedSlug = `${generatedSlug}-${Date.now()}`;

    this.slug = generatedSlug;

    next();
  } catch (error) {
    logger.error("Error generating slug: ", error);
    next(error);
  }
});

export const Product = mongoose.model("Product", productSchema);
