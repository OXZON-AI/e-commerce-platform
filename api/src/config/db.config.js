import mongoose from "mongoose";
import { logger } from "../utils/logger.util.js";
import {
  watchOrders,
  watchProducts,
  watchVariants,
} from "../services/changeStream.service.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    watchOrders();
    watchProducts();
    watchVariants();
    logger.info("Connected to mongodb");
  } catch (error) {
    logger.error("Error connecting to mongodb: ", error);
  }
};
