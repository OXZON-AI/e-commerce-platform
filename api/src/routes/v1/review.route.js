import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import {
  createReview,
  getReviews,
} from "../../controllers/review.controller.js";
import { filterGuest } from "../../middleware/filterGuest.middleware.js";

const route = express.Router();

route.post("/", verifyToken, filterGuest, createReview);
route.get("/:slug", getReviews);

export default route;
