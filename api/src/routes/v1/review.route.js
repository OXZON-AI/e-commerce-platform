import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import {
  createReview,
  getReviews,
} from "../../controllers/review.controller.js";

const route = express.Router();

route.post("/", verifyToken, createReview);
route.get("/:slug", getReviews);

export default route;
