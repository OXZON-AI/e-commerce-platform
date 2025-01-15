import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Variant } from "../models/variant.model.js";
import { logger } from "../utils/logger.util.js";
import { validateCreateProduct } from "../utils/validator.util.js";

export const createProduct = async (req, res, next) => {
  const { error, value } = validateCreateProduct(req.body);

  if (error) return next(error);

  const { name, slug, description, category, brand, variants } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = new Product({
      name,
      slug,
      description,
      category,
      brand,
    });

    const { _id } = await product.save({ session });

    await Promise.all(
      variants.map(async (item) => {
        const variant = new Variant({
          ...item,
          product: _id,
        });

        await variant.save({ session });
      })
    );

    await session.commitTransaction();
    await session.endSession();

    logger.info("Product created successfully.");
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    logger.error("Error creating product: ", error);
    return next(error);
  }
};

export const getProduct = async (req, res, next) => {};

export const getProducts = async (req, res, next) => {
  try {
  } catch (error) {
    logger.error("Error fetching products: ", error);
    return next(error);
  }
};

export const updateProduct = async (req, res, next) => {};

export const deleteProduct = async (req, res, next) => {};
