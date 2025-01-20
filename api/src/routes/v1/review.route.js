import express from "express";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";
import { createReview } from "../../controllers/review.controller.js";

const route = express.Router();

route.post("/", verifyToken, createReview);

export default route;
