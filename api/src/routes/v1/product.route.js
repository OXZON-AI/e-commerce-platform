import express from "express";
import {
  createProduct,
  createVariant,
  deleteProduct,
  deleteVariant,
  getProduct,
  getProducts,
  updateProduct,
  updateVariant,
} from "../../controllers/product.controller.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createProduct);
router.post("/:pid/variants", verifyToken, verifyAdmin, createVariant);
router.get("/", getProducts);
router.get("/:slug", getProduct);
router.put("/:pid", verifyToken, verifyAdmin, updateProduct);
router.put("/:pid/variants/:vid", verifyToken, verifyAdmin, updateVariant);
router.delete("/:pid", verifyToken, verifyAdmin, deleteProduct);
router.delete("/:pid/variants/:vid", verifyToken, verifyAdmin, deleteVariant);

export default router;
