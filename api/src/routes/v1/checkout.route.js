import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import {
  completeCheckout,
  processCheckout,
} from "../../controllers/checkout.controller.js";

const route = express.Router();

route.post("/process", verifyToken, processCheckout);
route.post("/complete", verifyToken, completeCheckout);

export default route;
