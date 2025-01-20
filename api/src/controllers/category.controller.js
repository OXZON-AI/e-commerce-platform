import { Category } from "../models/category.model.js";
import { logger } from "../utils/logger.util.js";
import { createCategorySchema } from "../utils/validationSchemas/category.schema.js";

export const createCategory = async (req, res, next) => {
  const { error, value } = createCategorySchema.validate(req.body);

  if (error) return next(error);

  const { name, description, parent, image, level } = value;

  try {
    const category = new Category({ name, description, parent, image, level });
    const { _id } = await category.save();

    logger.info(`Category with id ${_id} created successfully`);
    return res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    logger.error("Error creating category: ", error);
    return next(error);
  }
};
