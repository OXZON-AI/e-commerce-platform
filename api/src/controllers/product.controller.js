import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Variant } from "../models/variant.model.js";
import { logger } from "../utils/logger.util.js";
import {
  validateCreateProduct,
  validateCreateVariant,
  validateDeleteProduct,
  validateDeleteVariant,
  validateUpdateProduct,
  validateUpdateVariant,
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
    return res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    logger.error("Error creating product: ", error);
    return next(error);
  }
};

export const getProduct = async () => {};

export const getProducts = async (req, res, next) => {
  try {
  } catch (error) {
    logger.error("Error fetching products: ", error);
    return next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const { error, value } = validateUpdateProduct({
    pid: req.params.pid,
    ...req.body,
  });

  if (error) return next(error);

  const { pid, name, description, category, brand } = value;

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: pid },
      {
        $set: {
          name,
          description,
          category,
          brand,
        },
      },
      { new: true }
    );

    if (!product) {
      const error = customError(404, "Product not found");
      logger.error(`Product with id ${pid} not found: `, error);
      return next(error);
    }

    logger.info(`Product with id ${pid} updated successfully.`);
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    logger.error(`Error updating product with id ${pid}: `, error);
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { error, value } = validateDeleteProduct({ pid: req.params.pid });

  if (error) return next(error);

  const { pid } = value;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findByIdAndDelete(pid).session(session);

    if (!product) {
      const error = customError(404, "Product not found");
      logger.error(`Product with id ${pid} not found: `, error);
      return next(error);
    }

    await Variant.deleteMany({ product: pid }).session(session);

    await session.commitTransaction();
    await session.endSession();

    logger.info(`Product with id ${pid} deleted successfully.`);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    logger.error(`Error deleting product with id ${pid}: `, error);
    return next(error);
  }
};

export const createVariant = async (req, res, next) => {
  const { error, value } = validateCreateVariant({
    pid: req.params.pid,
    ...req.body,
  });

  if (error) return next(error);

  const { pid, attributes, price, compareAtPrice, images } = value;

  try {
    const productExists = await Product.exists({ _id: pid });

    if (!productExists) {
      const error = customError(404, "Product not found");
      logger.error(`Product with id ${pid} not found: `, error);
      return next(error);
    }

    const variant = new Variant({
      product: pid,
      attributes,
      price,
      compareAtPrice,
      images,
    });

    const { _id } = await variant.save();

    logger.info(`Variant with id ${_id} created successfully.`);
    return res.status(201).json({ message: "Variant created successfully" });
  } catch (error) {
    logger.error("Error creating variant: ", error);
    return next(error);
  }
};

export const updateVariant = async (req, res, next) => {
  const { error, value } = validateUpdateVariant({
    pid: req.params.pid,
    vid: req.params.vid,
    ...req.body,
  });

  if (error) return next(error);

  const {
    pid,
    vid,
    toAdd,
    toChange,
    toRemove,
    price,
    compareAtPrice,
    isDefault,
  } = value;

  const bulkOperations = [];

  bulkOperations.push({
    updateOne: {
      filter: {
        _id: vid,
        product: pid,
      },
      update: {
        $set: {
          price,
          compareAtPrice,
          isDefault,
        },
      },
    },
  });

  if (toAdd) {
    bulkOperations.push({
      updateOne: {
        filter: {
          _id: vid,
          product: pid,
        },
        update: {
          $addToSet: {
            attributes: {
              $each: toAdd.attributes,
            },
            images: {
              $each: toAdd.images,
            },
          },
        },
      },
    });
  }

  if (toRemove) {
    bulkOperations.push({
      updateOne: {
        filter: {
          _id: vid,
          product: pid,
        },
        update: {
          $pull: {
            attributes: {
              _id: {
                $in: toRemove.attributes,
              },
            },
            images: {
              _id: {
                $in: toRemove.images,
              },
            },
          },
        },
      },
    });
  }

  if (toChange) {
    for (const attribute of toChange.attributes) {
      bulkOperations.push({
        updateOne: {
          filter: { _id: vid, "attributes._id": attribute._id },
          update: {
            $set: {
              "attributes.$.name": attribute.name,
              "attributes.$.value": attribute.value,
            },
          },
        },
      });
    }

    for (const image of toChange.images) {
      bulkOperations.push({
        updateOne: {
          filter: { _id: vid, "images._id": image._id },
          update: {
            $set: {
              "images.$.url": image.url,
              "images.$.alt": image.alt,
              "images.$.isDefault": image.isDefault,
            },
          },
        },
      });
    }
  }

  try {
    const { matchedCount } = await Variant.bulkWrite(bulkOperations);

    if (!matchedCount) {
      const error = customError(404, "Variant not found");
      logger.error(`Variant with id ${vid} not found: `, error);
      return next(error);
    }

    logger.info(`Variant with id ${vid} updated successfully.`);
    return res.status(200).json({ message: "Variant updated successfully" });
  } catch (error) {
    logger.error(`Error updating variant with id ${vid}: `, error);
    return next(error);
  }
};

export const deleteVariant = async (req, res, next) => {
  const { error, value } = validateDeleteVariant({
    pid: req.params.pid,
    vid: req.params.vid,
  });

  if (error) return next(error);

  const { pid, vid } = value;

  try {
    const variant = await Variant.findOneAndDelete({ _id: vid, product: pid });

    if (!variant) {
      const error = customError(404, "Variant not found");
      logger.error(`Variant with id ${vid} not found: `, error);
      return next(error);
    }

    logger.info(`Variant with id ${vid} deleted successfully.`);
    return res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting variant with id ${vid}: `, error);
    return next(error);
  }
};
