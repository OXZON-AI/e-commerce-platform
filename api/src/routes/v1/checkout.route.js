import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import {
  handleWebhook,
  processCheckout,
} from "../../controllers/checkout.controller.js";

const route = express.Router();

route.post("/process", verifyToken, processCheckout);
route.post("/webhook", handleWebhook);

export default route;
