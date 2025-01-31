import { Category } from "../models/category.model.js";
import { buildCategoryTree } from "../services/category.service.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateCreateCategory,
  validateUpdateCategory,
} from "../utils/validator.util.js";

export const createCategory = async (req, res, next) => {
  const { error, value } = validateCreateCategory(req.body);

  if (error) return next(error);

  const { parent } = value;

  try {
    if (parent) {
      const exist = await Category.exists({ _id: parent });

      if (!exist) {
        const error = customError(404, "Parent category not found");

        logger.error(`Parent category ${parent} not found: `, error);
        return next(error);
      }
    }

    const category = new Category(value);
    const { _id } = await category.save();

    logger.info(`Category with id ${_id} created successfully.`);
    return res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    logger.error("Error creating category: ", error);
    return next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .select("-createdAt -updatedAt -__v")
      .lean();

    const categoryTree = buildCategoryTree(categories);

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

  const { cid, image, ...rest } = value;
  try {
    if (rest.parent) {
      const exist = await Category.exists({ _id: rest.parent });

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
        },
      },
      { new: true }
    );

    if (!category) {
      const error = customError(404, "Category not found");
      logger.error(`Category with id ${cid} not found: `, error);
      return next(error);
    }

    logger.info(`Category with id ${cid} updated successfully`);
    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    logger.error(`Error updating category with id ${cid}: `, error);
    return next(error);
  }
};
