import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../controllers/category.controller.js";

const route = express.Router();

route.post("/", verifyToken, verifyAdmin, createCategory);
route.get("/", getCategories);
route.put("/:cid", verifyToken, verifyAdmin, updateCategory);

export default route;
