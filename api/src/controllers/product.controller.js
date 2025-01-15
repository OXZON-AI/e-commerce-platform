import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Variant } from "../models/variant.model.js";
import { logger } from "../utils/logger.util.js";
import {
  validateCreateProduct,
  validateDeleteProduct,
} from "../utils/validator.util.js";
import { customError } from "../utils/error.util.js";

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

export const deleteProduct = async (req, res, next) => {
  const { error, value } = validateDeleteProduct({ id: req.params.id });

  if (error) return next(error);

  const { id } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findByIdAndDelete(id).session(session);

    if (!product) {
      const error = customError(404, "Product not found");
      logger.error(`Product with id ${id} not found: `, error);
      return next(error);
    }

    await Variant.deleteMany({ product: id }).session(session);

    await session.commitTransaction();
    await session.endSession();

    logger.info(`Product with id ${id} deleted successfully.`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    logger.error(`Error deleting product with id ${id}: `, error);
    return next(error);
  }
};
