import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import { validateCreateReview } from "../utils/validator.util.js";

export const createReview = async (req, res, next) => {
  const { error, value } = validateCreateReview(req.body);

  if (error) return next(error);

  const { variant, user, order } = value;

  try {
    const exist = await Order.exists({
      _id: order,
      "items.variant": variant,
      user,
    });

    if (!exist) {
      const error = customError(404, "Order not found");

      logger.error("Error: ", error);
      return next(error);
    }

    const review = Review(value);

    await review.save();

    logger.info(`Created review  order ${order}`);
    return res.status(201).json({ message: "Review posted successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const err = customError(400, "You have already reviewed this product.");
      logger.error(`Duplicate review attempt for order ${order}: `, err);
      return next(err);
    }

    logger.error(`Error creating the review for order ${order}: `, error);
    return next(error);
  }
};
