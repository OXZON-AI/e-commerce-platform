import { Order } from "../../models/order.model.js";
import { logger } from "../../utils/logger.util.js";
import { validateSalesSummary } from "../../utils/validator.util.js";
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
    logger.error("Failed to fetch sales analytics: ", error);
    return next(error);
  }
};
