import { Category } from "../models/category.model.js";
import { buildCategoryTree } from "../services/category.service.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import { createCategorySchema } from "../utils/validationSchemas/category.schema.js";

export const createCategory = async (req, res, next) => {
  const { error, value } = createCategorySchema.validate(req.body);

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
