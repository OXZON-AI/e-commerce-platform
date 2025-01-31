import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateCreateReview,
  validateGetReviews,
} from "../utils/validator.util.js";
import { Product } from "../models/product.model.js";
import { Variant } from "../models/variant.model.js";

export const createReview = async (req, res, next) => {
  const { id } = req.user;
  const { error, value } = validateCreateReview(req.body);

  if (error) return next(error);

  const { variant: vid, order } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const exist = await Order.exists({
      _id: order,
      "items.variant": vid,
      user: id,
    }).session(session);

    if (!exist) {
      const error = customError(404, "Order not found");
      logger.error("Error: ", error);
      return next(error);
    }

    const variant = await Variant.findById(vid)
      .select("product")
      .populate({ path: "product" })
      .session(session);

    if (!variant) {
      const error = customError(404, "Product not found");
      logger.error("Error: ", error);
      return next(error);
    }

    const newCount = variant.product.ratings.count + 1;
    const newAverage =
      (variant.product.ratings.average * variant.product.ratings.count +
        value.rating) /
      newCount;

    const review = Review({ user: id, ...value });

    await review.save({ session });

    await Product.findByIdAndUpdate(variant.product._id, {
      $set: { "ratings.count": newCount, "ratings.average": newAverage },
    }).session(session);

    await session.commitTransaction();

    logger.info(`Created review  order ${order}`);
    return res.status(201).json({ message: "Review posted successfully" });
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      const err = customError(400, "You have already reviewed this product.");
      logger.error(`Duplicate review attempt for order ${order}: `, err);
      return next(err);
    }

    logger.error(`Error creating the review for order ${order}: `, error);
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const getReviews = async (req, res, next) => {
  const { error, value } = validateGetReviews({
    slug: req.params.slug,
    ...req.query,
  });

  if (error) return next(error);

  const { slug, page, limit, rating, sortOrder } = value;
  const skip = (page - 1) * limit;

  const countsPipeline = [
    {
      $sortByCount: "$rating",
    },
    {
      $project: {
        _id: 0,
        rating: "$_id",
        count: 1,
      },
    },
  ];

  const reviewsPipeline = [
    {
      $lookup: {
        from: "variants",
        localField: "variant",
        foreignField: "_id",
        as: "variant",
      },
    },
    {
      $unwind: {
        path: "$variant",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "variant.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
      },
    },
    {
      $match: {
        "product.slug": slug,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
  ];

  if (rating)
    reviewsPipeline.push({
      $match: {
        rating,
      },
    });

  reviewsPipeline.push(
    {
      $sort: {
        rating: sortOrder === "asc" ? 1 : -1,
      },
    },
    {
      $project: {
        variant: {
          attributes: 1,
          sku: 1,
        },
        user: {
          name: 1,
        },
        rating: 1,
        title: 1,
        comment: 1,
        images: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    }
  );

  try {
    const [counts, reviews] = await Promise.all([
      Review.aggregate(countsPipeline),
      Review.aggregate(reviewsPipeline),
    ]);

    logger.info(`Fetched reviews for ${slug}.`);
    return res.status(200).json({ counts, reviews });
  } catch (error) {
    logger.error(`Error getting the review for product ${slug}: `, error);
    return next(error);
  }
};
