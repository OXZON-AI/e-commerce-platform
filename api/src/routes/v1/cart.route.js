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

route.post("/items", optionalAuth, addToCart);
route.get("/", optionalAuth, getCart);
route.put("/items/:vid", verifyToken, updateCart);
route.delete("/items/:vid", verifyToken, removeFromCart);

export default route;
