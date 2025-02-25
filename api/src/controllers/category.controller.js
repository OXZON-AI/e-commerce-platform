import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import {
  buildCategoryTree,
  getIdsForDelete,
} from "../services/category.service.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateCreateCategory,
  validateDeleteCategory,
  validateUpdateCategory,
} from "../utils/validator.util.js";
import { Product } from "../models/product.model.js";

export const createCategory = async (req, res, next) => {
  const { error, value } = validateCreateCategory(req.body);

  if (error) return next(error);

  const { parent, ...rest } = value;

  try {
    if (parent) {
      const exist = await Category.exists({ _id: parent });

      if (!exist) {
        const error = customError(404, "Parent category not found");

        logger.error(`Parent category ${parent} not found: `, error);
        return next(error);
      }
    }

    const category = new Category({ parent: parent ? parent : null, ...rest });
    const { _id } = await category.save();

    logger.info(`Category with id ${_id} created successfully.`);
    return res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    logger.error("Error creating category: ", error);
    return next(error);
  }
};

export const getCategories = async (req, res, next) => {
  const { role } = req.user;

  try {
    const categories = await Category.find().select("-__v").lean();

    const categoryTree = buildCategoryTree(categories, role);

    logger.info(`Categories fetched successfully.`);
    return res.status(200).json({ categories: categoryTree });
  } catch (error) {
    logger.error("Error fetching categories: ", error);
    return next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const { error, value } = validateUpdateCategory({
    cid: req.params.cid,
    ...req.body,
  });

  if (error) return next(error);

  const { cid, image, isActive, ...rest } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (rest.parent) {
      const exist = await Category.exists({ _id: rest.parent }).session(
        session
      );

      if (!exist) {
        const error = customError(404, "Parent category not found");

        logger.error(`Parent category ${rest.parent} not found: `, error);
        return next(error);
      }
    }

    const category = await Category.findByIdAndUpdate(
      cid,
      {
        $set: {
          ...rest,
          ...(image && { "image.url": image.url, "image.alt": image.alt }),
          isActive,
        },
      },
      { new: true }
    ).session(session);

    if (!category) {
      const error = customError(404, "Category not found");
      logger.error(`Category with id ${cid} not found: `, error);
      return next(error);
    }

    await Product.updateMany({ category: cid }, { $set: { isActive } }).session(
      session
    );

    await session.commitTransaction();

    logger.info(`Category with id ${cid} updated successfully`);
    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Error updating category with id ${cid}: `, error);
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const deleteCategory = async (req, res, next) => {
  const { error, value } = validateDeleteCategory(req.params);

  if (error) return next(error);

  const { cid } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const ids = await getIdsForDelete(cid, session);

    const { deletedCount } = await Category.deleteMany({
      _id: { $in: ids },
    }).session(session);

    if (!deletedCount) {
      const error = customError(404, "Category not found");
      logger.error(`Category with id ${cid} not found: `, error);
      return next(error);
    }

    await Product.updateMany(
      { category: { $in: ids } },
      { $set: { category: null, isActive: false } }
    ).session(session);

    await session.commitTransaction();

    logger.info(`Category with id ${cid} deleted successfully`);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Error deleting category with id ${cid}: `, error);
    return next(error);
  } finally {
    await session.endSession();
  }
};
