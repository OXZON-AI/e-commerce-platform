import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../controllers/category.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.middleware.js";

const route = express.Router();

route.post("/", verifyToken, verifyAdmin, createCategory);
route.get("/", optionalAuth, getCategories);
route.put("/:cid", verifyToken, verifyAdmin, updateCategory);
route.delete("/:cid", verifyToken, verifyAdmin, deleteCategory);

export default route;
