import express from "express";
import {
  createProduct,
  getProducts,
} from "../../controllers/product.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.middleware.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createProduct);
router.get("/", optionalAuth, getProducts);

export default router;
