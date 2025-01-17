import express from "express";
import { optionalAuth } from "../../middleware/optionalAuth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../../controllers/cart.controller.js";
import { verifyToken } from "../../middleware/verifyToken.middleware.js";

const route = express.Router();

route.get("/", optionalAuth, getCart);

export default route;
