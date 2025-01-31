import { Order } from "../../models/order.model.js";
import { Variant } from "../../models/variant.model.js";
import {
  generateOrdersExcel,
  generateProductsExcel,
} from "../../services/analytics.service.js";
import { logger } from "../../utils/logger.util.js";
import {
  validateSalesPerformance,
  validateSalesSummary,
} from "../../utils/validator.util.js";
import { performancePipeline } from "./pipelines/sales/performance.pipline.js";
import { summaryPipeline } from "./pipelines/sales/summary.pipeline.js";

export const salesSummary = async (req, res, next) => {
  const { error, value } = validateSalesSummary(req.query);

  if (error) return next(error);

  const { userType, status, startDate, endDate } = value;

  const pipeline = [...summaryPipeline];

  pipeline.unshift({
    $match: {
      ...(userType && { isGuest: userType === "customer" ? false : true }),
      ...(status && { status }),
      ...(startDate && {
        createdAt: {
          $gte: new Date(startDate),
          ...(endDate && { $lt: new Date(endDate) }),
        },
      }),
    },
  });

  try {
    const summary = await Order.aggregate(pipeline);

    logger.info("Sales summary fetched successfully.");
    return res.status(200).json(summary[0]);
  } catch (error) {
    logger.error("Failed to fetch sales summary analytics: ", error);
    return next(error);
  }
};

export const salesPerformance = async (req, res, next) => {
  const { error, value } = validateSalesPerformance(req.query);

  if (error) return next(error);

  const { userType, status, interval, startDate, endDate } = value;

  const pipeline = [...performancePipeline];

  pipeline.unshift({
    $match: {
      ...(userType && { isGuest: userType === "customer" ? false : true }),
      ...(status && { status }),
      ...(startDate && {
        createdAt: {
          $gte: new Date(startDate),
          ...(endDate && { $lt: new Date(endDate) }),
        },
      }),
    },
  });

  pipeline.splice(4, 0, {
    $group: {
      _id: {
        $dateToString: {
          format:
            interval === "year"
              ? "%Y-%m-%d"
              : interval === "month"
              ? "%Y-%m"
              : interval === "week"
              ? "%Y-%U"
              : "%Y-%m-%d",
          date: "$createdAt",
        },
      },
      orderCount: {
        $sum: 1,
      },
      revenue: {
        $sum: "$payment.amount",
      },
      cost: {
        $sum: "$cost",
      },
      averageOrderValue: {
        $avg: "$payment.amount",
      },
    },
  });

  try {
    const performance = await Order.aggregate(pipeline);

    logger.info("Sales performance fetched successfully.");
    return res.status(200).json(performance);
  } catch (error) {
    logger.error("Failed to fetch sales performance analytics: ", error);
    return next(error);
  }
};

export const salesExport = async (req, res, next) => {
  try {
    const orders = await Order.find().lean();

    const workbook = generateOrdersExcel(orders);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    await workbook.xlsx.write(res);

    logger.info("Sales excel exported successfully.");
    res.status(200).end();
  } catch (error) {
    logger.error("Failed to export sales excel: ", error);
    return next(error);
  }
};

export const productsExport = async (req, res, next) => {
  try {
    const data = await Variant.aggregate([
      {
        $group: {
          _id: "$product",
          variants: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },
    ]);

    const workbook = generateProductsExcel(data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");

    await workbook.xlsx.write(res);

    logger.info("Products excel exported successfully.");
    res.status(200).end();
  } catch (error) {
    logger.error("Failed to export products excel: ", error);
    return next(error);
  }
};
