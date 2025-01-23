import { Order } from "../models/order.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateGetOrders,
  validateUpdateStatus,
} from "../utils/validator.util.js";
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
      $lookup: {
        from: "products",
        localField: "variants.product",
        foreignField: "_id",
        as: "products",
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
        status: 1,
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              quantity: "$$item.quantity",
              subTotal: "$$item.subTotal",
              variant: {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$variants",
                          as: "variant",
                          cond: {
                            $eq: ["$$variant._id", "$$item.variant"],
                          },
                        },
                      },
                      as: "variant",
                      in: {
                        _id: "$$variant._id",
                        sku: "$$variant.sku",
                        attributes: "$$variant.attributes",
                        product: {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$products",
                                    as: "product",
                                    cond: {
                                      $eq: [
                                        "$$variant.product",
                                        "$$product._id",
                                      ],
                                    },
                                  },
                                },
                                as: "product",
                                in: {
                                  _id: "$$product._id",
                                  name: "$$product.name",
                                  slug: "$$product.slug",
                                  description: "$$product.description",
                                  ratings: "$$product.ratings",
                                  brand: "$$product.brand",
                                },
                              },
                            },
                            0,
                          ],
                        },
                        image: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$$variant.images",
                                as: "image",
                                cond: {
                                  $eq: ["$$image.isDefault", true],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
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

export const updateOrderStatus = async (req, res, next) => {
  const { error, value } = validateUpdateStatus({
    oid: req.params.oid,
    ...req.body,
  });

  if (error) return next(error);

  const { oid, status } = value;

  try {
    const order = await Order.findByIdAndUpdate(
      oid,
      {
        $set: {
          status,
        },
      },
      { new: true }
    );

    if (!order) {
      const error = customError(404, "Order not found");
      logger.error(`Order with id ${oid} not found: `, error);
      return next(error);
    }

    logger.info(`Status of the order with id ${oid} updated successfully.`);
    return res
      .status(200)
      .json({ message: "Status updated successfully", order });
  } catch (error) {
    logger.error(`Error updating status for order ${oid}: `, error);
    return next(error);
  }
};
