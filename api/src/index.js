import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/v1/auth.route.js";
import userRouter from "./routes/v1/user.route.js";
import productRouter from "./routes/v1/product.route.js";
import categoryRouter from "./routes/v1/category.route.js";
import cartRouter from "./routes/v1/cart.route.js";
import checkoutRouter from "./routes/v1/checkout.route.js";
import reviewRouter from "./routes/v1/review.route.js";
import orderRouter from "./routes/v1/order.route.js";
import analyticsRouter from "./routes/v1/analytics.route.js";

import contactRouter from "./routes/v1/contactus.routes.js"; // ✅ Added contact route
import helmet from "helmet";
import { errorMiddleware } from "./middleware/error.middleware.js";
import dotenv from "dotenv";
import { logger } from "./utils/logger.util.js";
import cors from "cors";
import { connectDB } from "./config/db.config.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use("/v1/checkout/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cookieParser());

// ✅ Register the new contact route
app.use("/v1/contact", contactRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
app.use("/v1/products", productRouter);
app.use("/v1/categories", categoryRouter);
app.use("/v1/carts", cartRouter);
app.use("/v1/checkout", checkoutRouter);
app.use("/v1/reviews", reviewRouter);
app.use("/v1/orders", orderRouter);
app.use("/v1/analytics", analyticsRouter);
app.use("/v1/contact", contactRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT}`);
});
