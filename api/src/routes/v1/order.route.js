import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import {
  cancelOrder,
  getOrders,
  updateOrderStatus,
} from "../../controllers/order.controller.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";
import { filterGuest } from "../../middleware/filterGuest.middleware.js";

const route = express.Router();

route.get("/", verifyToken, filterGuest, getOrders);
route.patch("/:oid", verifyToken, verifyAdmin, updateOrderStatus);
route.patch("/:oid/cancel", verifyToken, filterGuest, cancelOrder);

export default route;
