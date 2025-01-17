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

export const addToCart = async (req, res, next) => {
  const { id, role } = req.user;
  const { error, value } = validateAddToCart(req.body);

  if (error) return next(error);

  const { variant: vid, quantity } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const variant = await Variant.findById(vid)
      .select("price stock")
      .lean()
      .session(session);

    if (!variant) {
      const error = customError(404, "Variant not found");
      logger.error(`Variant with id ${vid} not found: `, error);
      return next(error);
    }

    if (variant.stock < quantity) {
      const error = customError(400, "Insufficient stock");
      logger.error(`Insufficient stock for variant with id ${vid}: `, error);
      return next(error);
    }

    let cart = await findOrCreateCart(id, role, session);

    const item = cart.items.find((item) => item.variant._id == vid);

    let subTotal = 0;

    if (item) {
      item.quantity += quantity;
      subTotal = quantity * item.variant.price;
      item.subTotal += subTotal;
    } else {
      subTotal = quantity * variant.price;
      cart.items.push({
        variant: vid,
        quantity,
        subTotal,
      });
    }

    await Variant.findByIdAndUpdate(vid, {
      $inc: { stock: -quantity },
    }).session(session);

    cart.total += subTotal;

    await cart.save({ session });

    await session.commitTransaction();

    logger.info(
      `Variant with id ${vid} added to cart with id ${cart._id} for user ${id}.`
    );
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    await session.abortTransaction();

    logger.error(
      `Error adding variant with id ${vid} to cart for user ${id}: `,
      error
    );
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const removeFromCart = async (req, res, next) => {
  const { id, role } = req.user;
  const { error, value } = validateRemoveFromCart(req.params);

  if (error) return next(error);

  const { vid } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let cart = await findOrCreateCart(id, role, session);

    const item = cart.items.find((item) => item.variant._id == vid);

    if (!item) {
      const error = customError(404, "Item not found in cart");
      logger.error(
        `Item with variant id ${vid} not found in cart with id ${cart._id}: `,
        error
      );
      return next(error);
    }

    cart.total -= item.subTotal;

    await Variant.findByIdAndUpdate(vid, {
      $inc: { stock: item.quantity },
    }).session(session);

    cart.items = cart.items.filter((item) => item.variant._id != vid);

    await cart.save({ session });

    await session.commitTransaction();

    logger.info(
      `Variant with id ${vid} removed from cart with id ${cart._id} for user ${id}.`
    );
    return res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Error removing item from cart: `, error);
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const updateCart = async (req, res, next) => {
  const { id, role } = req.user;
  const { error, value } = validateUpdateCart({
    vid: req.params.vid,
    quantity: req.body.quantity,
  });

  if (error) return next(error);

  const { vid, quantity } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let cart = await findOrCreateCart(id, role, session);

    const item = cart.items.find((item) => item.variant._id == vid);

    if (!item) {
      const error = customError(404, "Item not found in cart");
      logger.error(
        `Item with variant id ${vid} not found in cart with id ${cart._id}: `,
        error
      );
      return next(error);
    }

    const variant = await Variant.findById(vid)
      .select("price stock")
      .lean()
      .session(session);

    if (!variant) {
      const error = customError(404, "Variant not found");
      logger.error(`Variant with id ${vid} not found: `, error);
      return next(error);
    }

    const diff = quantity - item.quantity;

    if (diff > 0 && variant.stock < diff) {
      const error = customError(400, "Insufficient stock");
      logger.error(`Insufficient stock for variant with id ${vid}: `, error);
      return next(error);
    }

    item.quantity = quantity;
    item.subTotal = quantity * variant.price;

    cart.total += diff * variant.price;

    await Variant.findByIdAndUpdate(vid, {
      $inc: { stock: -diff },
    }).session(session);

    await cart.save({ session });

    await session.commitTransaction();

    logger.info(
      `Cart with id ${cart._id} updated successfully for user ${id}.`
    );
    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Error updating cart: `, error);
    return next(error);
  } finally {
    await session.endSession();
  }
};
