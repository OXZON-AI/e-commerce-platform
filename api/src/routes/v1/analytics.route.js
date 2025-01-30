import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";
import {
  salesPerformance,
  salesSummary,
} from "../../controllers/analytics/analytics.controller.js";

const route = express.Router();

route.get("/sales/summary", verifyToken, verifyAdmin, salesSummary);
route.get("/sales/performance", verifyToken, verifyAdmin, salesPerformance);

export default route;
