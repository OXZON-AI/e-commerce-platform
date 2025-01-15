import express from "express";
import {
  createProduct,
  createVariant,
  deleteProduct,
  deleteVariant,
  getProducts,
  updateProduct,
} from "../../controllers/product.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.middleware.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createProduct);
router.post("/:pid/variants", verifyToken, verifyAdmin, createVariant);
router.get("/", optionalAuth, getProducts);
router.put("/:pid", verifyToken, verifyAdmin, updateProduct);
router.delete("/:pid", verifyToken, verifyAdmin, deleteProduct);
router.delete("/:pid/variants/:vid", verifyToken, verifyAdmin, deleteVariant);

export default router;
