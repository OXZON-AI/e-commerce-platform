import { Order } from "../models/order.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import { validateGetOrders } from "../utils/validator.util.js";
import mongoose from "mongoose";

export const getOrders = async (req, res, next) => {
  const { id, role } = req.user;

  const { error, value } = validateGetOrders(req.query);

  if (error) return next(error);

  const { customer, guestOnly, status, sortBy, sortOrder, page, limit } = value;
  const skip = (page - 1) * limit;
  const sortByField = sortBy === "total" ? "payment.amount" : "createdAt";

  if (role === "customer" && customer && id !== customer) {
    const error = customError(403, "Action is forbidden");
    logger.error(
      `User ${id} tried to access the orders of the user ${customer}: `,
      error
    );
    return next(error);
  }

  const pipeline = [];

  pipeline.push({
    $match: {
      ...((customer || role === "customer") && {
        user: new mongoose.Types.ObjectId(`${customer ? customer : id}`),
      }),
      ...(status && { status }),
      isGuest: guestOnly,
    },
  });

  pipeline.push(
    {
      $skip: skip,
    },
    {
      $limit: limit,
    }
  );

  pipeline.push(
    {
      $lookup: {
        from: "variants",
        localField: "items.variant",
        foreignField: "_id",
        as: "variants",
      },
    },
    {
      $project: {
        user: 1,
        isGuest: 1,
        email: 1,
        payment: 1,
        billing: 1,
        shipping: 1,
        items: 1,
        products: {
          $map: {
            input: "$variants",
            as: "variant",
            in: {
              id: "$$variant.product",
            },
          },
        },
      },
    }
  );

  pipeline.push({
    $sort: {
      [sortByField]: sortOrder === "asc" ? 1 : -1,
    },
  });

  try {
    const orders = await Order.aggregate(pipeline);

    logger.info("Orders fetched successfully.");
    return res.status(200).json(orders);
  } catch (error) {
    logger.error(`Error fetching orders for user ${id}: `, error);
    return next(error);
  }
};
