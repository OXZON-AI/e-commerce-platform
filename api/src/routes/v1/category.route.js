import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.middleware.js";
import { createCategory } from "../../controllers/category.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createCategory);

export default router;
