import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  createVariant,
  deleteVariant,
  updateVariant,
  productRecommendations,
  relatedProducts,
} from "../../controllers/product/index.js";
import { filterGuest } from "../../middleware/filterGuest.middleware.js";
import { optionalAuth } from "../../middleware/optionalAuth.middleware.js";

const route = express.Router();

route.post("/", verifyToken, verifyAdmin, createProduct);
route.post("/:pid/variants", verifyToken, verifyAdmin, createVariant);
route.get("/", optionalAuth, getProducts);
route.get("/recommendations", verifyToken, filterGuest, productRecommendations);
route.get("/related", relatedProducts);
route.get("/:slug", optionalAuth, getProduct);
route.put("/:pid", verifyToken, verifyAdmin, updateProduct);
route.put("/:pid/variants/:vid", verifyToken, verifyAdmin, updateVariant);
route.delete("/:pid", verifyToken, verifyAdmin, deleteProduct);
route.delete("/:pid/variants/:vid", verifyToken, verifyAdmin, deleteVariant);

export default route;
