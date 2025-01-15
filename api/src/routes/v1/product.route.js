import express from "express";
import {
  createProduct,
  deleteProduct,
  deleteVariant,
  getProducts,
} from "../../controllers/product.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.middleware.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createProduct);
router.get("/", optionalAuth, getProducts);
router.delete("/:pid", verifyToken, verifyAdmin, deleteProduct);
router.delete("/:pid/variants/:vid", verifyToken, verifyAdmin, deleteVariant);

export default router;
