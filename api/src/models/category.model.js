import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.util.js";
import { logger } from "../utils/logger.util.js";

const categorySchema = new mongoose.Schema(
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
      type: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      url: String,
      alt: String,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", async function (next) {
  let generatedSlug = generateSlug(this.name);
  try {
    const exists = await mongoose
      .model("Category")
      .findOne({ slug: generatedSlug, _id: { $ne: this._id } });

    if (exists) generatedSlug = `${generatedSlug}-${Date.now()}`;

    this.slug = generatedSlug;
    next();
  } catch (error) {
    logger.error("Error generating slug: ", error);
    next(error);
  }
});

export const Category = mongoose.model("Category", categorySchema);
