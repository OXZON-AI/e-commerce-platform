import { Order } from "../models/order.model.js";
import { logger } from "../utils/logger.util.js";
import { validateGetOrders } from "../utils/validator.util.js";

export const getOrders = async (req, res, next) => {
  const { id, role } = req.user;

  const { error, value } = validateGetOrders(req.query);

  if (error) return next(error);

  const { user, guestOnly, status, sortBy, sortOrder, page, limit } = value;
  const skip = (page - 1) * limit;
  const sortByField = sortBy === "total" ? "payment.amount" : "createdAt";

  const pipeline = [];

  pipeline.push({
    $match: {
      ...((user || role === "customer") && {
        user: new ObjectId(user ? user : id),
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
