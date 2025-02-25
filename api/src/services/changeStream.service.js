import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Variant } from "../models/variant.model.js";
import { sendEmails } from "../utils/emailer.util.js";
import { cartCleanup } from "./cart.service.js";
import { logger } from "../utils/logger.util.js";

export const watchOrders = () => {
  const changeStream = Order.watch();

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const order = await Order.populate(change.fullDocument, [
        {
          path: "items.variant",
          select: "product",
          populate: { path: "product", select: "name" },
        },
      ]);

      order.total = 0;

      order.items.forEach((item) => {
        order.total += item.subTotal;
      });

      await sendEmails(
        order.email,
        "Purchase confirmed",
        {
          order,
        },
        "receipt"
      );
    }

    if (change.operationType === "update") {
      const order = await Order.findById(change.documentKey._id).populate({
        path: "items.variant",
        select: "product",
        populate: { path: "product", select: "name" },
      });

      order.total = 0;

      order.items.forEach((item) => {
        order.total += item.subTotal;
      });

      await sendEmails(
        order.email,
        order.status === "cancelled"
          ? "Your Order is cancelled"
          : "Your Order Status Has Changed",
        {
          order,
        },
        order.status === "cancelled" ? "order-cancelled" : "order-status"
      );
    }
  });
};

export const watchProducts = () => {
  const pipeline = [
    {
      $match: {
        operationType: "update",
        "updateDescription.updatedFields.isActive": { $exists: true },
      },
    },
  ];

  const changeStream = Product.watch(pipeline);

  const cleanupJob = async (pid) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const variants = await Variant.find({
        product: pid,
      });

      await Promise.all(
        variants.map((variant) => cartCleanup(variant._id, session))
      );

      await session.commitTransaction();

      logger.info(`Carts cleaned up for product ${pid}.`);
    } catch (error) {
      await session.abortTransaction();

      logger.error(`Error cleaning up carts for product ${pid}: `, error);
    } finally {
      await session.endSession();
    }
  };

  changeStream.on("change", async (change) => {
    if (change.updateDescription.updatedFields.isActive === false) {
      await cleanupJob(change.documentKey._id);
    }
  });
};

export const watchVariants = async () => {
  const pipeline = [
    {
      $match: {
        operationType: "delete",
      },
    },
  ];

  const changeStream = Variant.watch(pipeline);

  const cleanupJob = async (vid) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await cartCleanup(vid, session);

      await session.commitTransaction();

      logger.info(`Carts cleaned up for variant ${vid}.`);
    } catch (error) {
      await session.abortTransaction();

      logger.error(`Error cleaning up carts for variant ${vid}: `, error);
    } finally {
      await session.endSession();
    }
  };

  changeStream.on("change", async (change) => {
    await cleanupJob(change.documentKey._id);
  });
};
