import mongoose from "mongoose";
import { Variant } from "../models/variant.model.js";
import { findOrCreateCart } from "../services/cart.service.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateAddToCart,
  validateRemoveFromCart,
  validateUpdateCart,
} from "../utils/validator.util.js";

export const getCart = async (req, res, next) => {
  const { id, role } = req.user;

  try {
    let cart = await findOrCreateCart(id, role);

    logger.info(`Cart for user ${id} retrieved successfully.`);
    return res.status(200).json(cart);
  } catch (error) {
    logger.error(`Error getting the cart for id ${id}: `, error);
    return next(error);
  }
};

