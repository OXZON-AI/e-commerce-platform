import { Order } from "../models/order.model.js";
import { Variant } from "../models/variant.model.js";
import { cancel } from "../services/order.service.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateCancelOrder,
  validateGetOrders,
  validateUpdateStatus,
} from "../utils/validator.util.js";
import mongoose from "mongoose";
import Stripe from "stripe";

export const getOrders = async (req, res, next) => {
  const { id, role } = req.user;

  const { error, value } = validateGetOrders(req.query);

  if (error) return next(error);

  const { customer, guestOnly, status, sortBy, sortOrder, page, limit } = value;
  const skip = (page - 1) * limit;

  if (role === "customer" && customer && id !== customer) {
    const error = customError(403, "Action is forbidden");
    logger.error(
      `User ${id} tried to access the orders of the user ${customer}: `,
      error
    );
    return next(error);
  }

  const pipeline = [];
  const ordersPipeline = [];

  pipeline.push({
    $match: {
      ...((customer || role === "customer") && {
        user: new mongoose.Types.ObjectId(`${customer ? customer : id}`),
      }),
      ...(status && { status }),
      ...(role === "admin" && { isGuest: guestOnly }),
    },
  });

  ordersPipeline.push(
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
        pipeline: [
          {
            $project: {
              "description.detailed": 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    }
  );

  ordersPipeline.push({
    $project: {
      user: {
        $first: "$user",
      },
      isGuest: 1,
      email: 1,
      payment: 1,
      billing: 1,
      shipping: 1,
      status: 1,
      createdAt: 1,
      earnedPoints: 1,
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
                                    $eq: ["$$variant.product", "$$product._id"],
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
  });

  if (sortBy) {
    const sortByField = sortBy === "total" ? "payment.amount" : "createdAt";
    ordersPipeline.push({
      $sort: {
        [sortByField]: sortOrder === "asc" ? 1 : -1,
      },
    });
  }

  ordersPipeline.push(
    {
      $skip: skip,
    },
    {
      $limit: limit,
    }
  );

  pipeline.push({
    $facet: {
      orders: ordersPipeline,
      count: [
        {
          $count: "totalCount",
        },
      ],
    },
  });

  pipeline.push({
    $project: {
      orders: 1,
      paginationInfo: {
        totalCount: {
          $ifNull: [{ $first: "$count.totalCount" }, 0],
        },
        totalPages: {
          $ceil: {
            $divide: [
              {
                $ifNull: [{ $first: "$count.totalCount" }, 0],
              },
              limit,
            ],
          },
        },
      },
    },
  });

  try {
    const [{ orders, paginationInfo }] = await Order.aggregate(pipeline);

    logger.info("Orders fetched successfully.");
    return res.status(200).json({ orders, paginationInfo });
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

  const { oid, user, isGuest, status } = value;
  try {
    let order = null;

    if (status === "cancelled") {
      order = await cancel(oid, user, isGuest);
    } else {
      order = await Order.findOne({ _id: oid, isGuest });

      if (!order) {
        const error = customError(404, "Order not found");
        logger.error(`Order with id ${oid} not found: `, error);
        return next(error);
      }

      if (order.status === "cancelled") {
        const error = customError(
          400,
          "Can't update status of cancelled order"
        );
        logger.error(
          `Attempt to update status of cancelled order with id ${oid}: `,
          error
        );
        return next(error);
      }

      order.status = status;
      await order.save();
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

export const cancelOrder = async (req, res, next) => {
  const { id } = req.user;
  const { error, value } = validateCancelOrder(req.params);

  if (error) return next(error);

  const { oid } = value;

  try {
    await cancel(oid, id);

    return res.status(200).json({
      message:
        "Order cancelled successfully. It may take a few days for the money to reach you.",
    });
  } catch (error) {
    logger.error(`Order ${oid} cancel failed for user ${id}: `, error);
    return next(error);
  }
};
