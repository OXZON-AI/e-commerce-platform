import express from "express";
import {
  createProduct,
  createVariant,
  deleteProduct,
  deleteVariant,
  getProduct,
  getProducts,
  productRecommendations,
  relatedProducts,
  updateProduct,
  updateVariant,
} from "../../controllers/product.controller.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";

const route = express.Router();

route.post("/", verifyToken, verifyAdmin, createProduct);
route.post("/:pid/variants", verifyToken, verifyAdmin, createVariant);
route.get("/", getProducts);
route.get("/recommendations", verifyToken, productRecommendations);
route.get("/related", relatedProducts);
route.get("/:slug", getProduct);
route.put("/:pid", verifyToken, verifyAdmin, updateProduct);
route.put("/:pid/variants/:vid", verifyToken, verifyAdmin, updateVariant);
route.delete("/:pid", verifyToken, verifyAdmin, deleteProduct);
route.delete("/:pid/variants/:vid", verifyToken, verifyAdmin, deleteVariant);

export default route;
