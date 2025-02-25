import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ variant: 1 });
reviewSchema.index({ order: 1, variant: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
