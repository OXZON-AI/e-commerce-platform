import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { customError } from "../utils/error.util.js";
import Stripe from "stripe";
import { Variant } from "../models/variant.model.js";
import { logger } from "../utils/logger.util.js";

export const cancel = async (oid, id, isGuest = false) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findOne({
      _id: oid,
      ...(isGuest ? { isGuest } : { user: id }),
    }).session(session);

    if (!order) {
      const error = customError(404, "Order not found");
      logger.error(`Order with id ${oid} not found: `, error);
      throw error;
    }

    if (order.status !== "pending") {
      const error = customError(
        400,
        order.status === "cancelled"
          ? "Order is already cancelled."
          : `Order is ${order.status}. Order can't be cancelled.`
      );

      logger.error(`Order not allowed to be cancelled: `, error);
      throw error;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const refund = await stripe.refunds.create({
      payment_intent: order.payment.transactionId,
    });

    const bulkOperations = [];

    order.items.forEach((item) => {
      bulkOperations.push({
        updateOne: {
          filter: { _id: item.variant },
          update: { $inc: { stock: item.quantity } },
        },
      });
    });

    order.payment.refundId = refund.id;
    order.status = "cancelled";

    await order.save({ session });
    await Variant.bulkWrite(bulkOperations, { session });

    await session.commitTransaction();

    logger.info(`Order ${oid} cancelled with refund id ${refund.id}.`);
    return order;
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Order ${oid} cancel failed: `, error);
    throw error;
  } finally {
    await session.endSession();
  }
};
