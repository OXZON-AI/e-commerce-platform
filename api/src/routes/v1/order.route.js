import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import {
  getOrders,
  updateOrderStatus,
} from "../../controllers/order.controller.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const route = express.Router();

route.get("/", verifyToken, getOrders);
route.patch("/:oid", verifyToken, verifyAdmin, updateOrderStatus);

export default route;
