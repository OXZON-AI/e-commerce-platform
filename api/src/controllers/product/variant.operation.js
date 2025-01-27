import { Product } from "../../models/product.model.js";
import { Variant } from "../../models/variant.model.js";
import { logger } from "../../utils/logger.util.js";
import {
  validateCreateVariant,
  validateDeleteVariant,
  validateUpdateVariant,
} from "../../utils/validator.util.js";
import { customError } from "../../utils/error.util.js";

export const createVariant = async (req, res, next) => {
  const { error, value } = validateCreateVariant({
    pid: req.params.pid,
    ...req.body,
  });

  if (error) return next(error);

  const { pid, attributes, price, compareAtPrice, cost, images } = value;

  try {
    const exist = await Product.exists({ _id: pid });

    if (!exist) {
      const error = customError(404, "Product not found");
      logger.error(`Product with id ${pid} not found: `, error);
      return next(error);
    }

    const variant = new Variant({
      product: pid,
      attributes,
      price,
      compareAtPrice,
      cost,
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
    cost,
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
          cost,
        },
      },
    },
  });

  if (toAdd) {
    const addToBulk = (filter, value) => {
      bulkOperations.push({
        updateOne: {
          filter: {
            _id: vid,
            product: pid,
            ...filter,
          },
          update: {
            $addToSet: { ...value },
          },
        },
      });
    };

    if (toAdd.attributes)
      addToBulk(
        {
          "attributes.name": {
            $nin: toAdd.attributes.map((attribute) => attribute.name),
          },
        },
        {
          attributes: {
            $each: toAdd.attributes,
          },
        }
      );

    if (toAdd.images)
      addToBulk(
        {
          "images.url": {
            $nin: toAdd.images.map((image) => image.url),
          },
        },
        {
          images: {
            $each: toAdd.images,
          },
        }
      );
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
    if ((price && !compareAtPrice) || (!price && compareAtPrice)) {
      const variant = await Variant.findOne({ _id: vid, product: pid })
        .select("price compareAtPrice")
        .lean();

      if (!variant) {
        const error = customError(404, "Variant not found");
        logger.error(`Variant with id ${vid} not found: `, error);
        return next(error);
      }

      if (price) {
        if (price > variant.compareAtPrice) {
          const error = customError(
            400,
            "Price cannot be greater than compareAtPrice"
          );

          logger.error("Price error: ", error);
          return next(error);
        }
      }

      if (compareAtPrice) {
        if (compareAtPrice < variant.price) {
          const error = customError(
            400,
            "CompareAtPrice cannot be less than price"
          );

          logger.error("CompareAtPrice error: ", error);
          return next(error);
        }
      }
    }

    const { matchedCount } = await Variant.bulkWrite(bulkOperations);

    if (!matchedCount) {
      const error = customError(
        404,
        "Variant with provided specifications not found"
      );
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
