import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";
import {
  categoryPerformance,
  productsExport,
  salesExport,
  salesPerformance,
  salesSummary,
} from "../../controllers/analytics/analytics.controller.js";

const route = express.Router();

route.get("/sales/summary", verifyToken, verifyAdmin, salesSummary);
route.get("/sales/performance", verifyToken, verifyAdmin, salesPerformance);
route.get("/sales/export", verifyToken, verifyAdmin, salesExport);
route.get(
  "/categories/performance",
  verifyToken,
  verifyAdmin,
  categoryPerformance
);
route.get("/products/export", verifyToken, verifyAdmin, productsExport);

export default route;
