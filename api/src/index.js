import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/v1/auth.route.js";
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
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cookieParser());

app.use("/v1/auth", authRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`server is running on ${PORT}`);
});
