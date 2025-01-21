import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { getOrders } from "../../controllers/order.controller.js";

const route = express.Router();

route.get("/", verifyToken, getOrders);

export default route;
