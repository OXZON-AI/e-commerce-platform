import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import {
  completeCheckout,
  processCheckout,
} from "../../controllers/checkout.controller.js";

const router = express.Router();

router.post("/process", verifyToken, processCheckout);
router.post("/complete", verifyToken, completeCheckout);

export default router;
