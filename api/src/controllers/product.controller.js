import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Variant } from "../models/variant.model.js";
import { logger } from "../utils/logger.util.js";
import {
  validateCreateProduct,
  validateCreateVariant,
  validateDeleteProduct,
  validateDeleteVariant,
  validateGetProduct,
  validateGetProducts,
  validateRecommendations,
  validateRelatedProducts,
  validateUpdateProduct,
  validateUpdateVariant,
} from "../utils/validator.util.js";
import { customError } from "../utils/error.util.js";
import { Order } from "../models/order.model.js";

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

    logger.info(`Product with id ${_id} created successfully.`);
    return res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    await session.abortTransaction();

    logger.error("Error creating product: ", error);
    return next(error);
  } finally {
    await session.endSession();
  }
};

export const getProduct = async (req, res, next) => {
  const { error, value } = validateGetProduct(req.params);

  if (error) return next(error);

  const { slug } = value;

  const pipeline = [
    {
      $match: {
        slug,
      },
    },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "product",
        as: "variants",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
        description: 1,
        category: {
          $arrayElemAt: [
            {
              $map: {
                input: "$category",
                as: "category",
                in: {
                  _id: "$$category._id",
                  name: "$$category.name",
                  slug: "$$category.slug",
                },
              },
            },

            0,
          ],
        },
        ratings: 1,
        brand: 1,
        variants: {
          attributes: 1,
          price: 1,
          compareAtPrice: 1,
          stock: 1,
          images: 1,
          isDefault: 1,
          sku: 1,
        },
      },
    },
  ];

  try {
    const product = await Product.aggregate(pipeline);

    if (!product.length) {
      const error = customError(404, "Product not found");
      logger.error(`Product with slug ${slug} not found: `, error);
      return next(error);
    }

    logger.info(`Product with slug ${slug} fetched successfully.`);
    return res.status(200).json(product[0]);
  } catch (error) {
    logger.error(`Error fetching product with slug ${slug}: `, error);
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  const { error, value } = validateGetProducts(req.query);

  if (error) return next(error);

  const {
    search,
    category,
    brand,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    page,
    limit,
  } = value;
  const skip = (page - 1) * limit;
  const sortByField =
    sortBy === "ratings" ? "ratings.average" : "defaultVariant.price";

  const pipeline = [];

  if (search) {
    pipeline.push({
      $search: {
        index: "default",
        text: {
          query: search,
          path: ["name", "description.short", "brand"],
          fuzzy: {
            maxEdits: 2,
            prefixLength: 0,
            maxExpansions: 50,
          },
        },
        count: {
          type: "total",
        },
      },
    });
  } else {
    pipeline.push({
      $match: {
        _id: { $exists: true },
      },
    });
  }

  pipeline.push({
    $lookup: {
      from: "variants",
      localField: "_id",
      foreignField: "product",
      as: "variants",
    },
  });

  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  });

  if (category || brand) {
    pipeline.push({
      $match: {
        ...(category && { "category.slug": category }),
        ...(brand && { brand }),
      },
    });
  }

  pipeline.push({
    $project: {
      name: 1,
      slug: 1,
      "description.short": 1,
      category: {
        $arrayElemAt: [
          {
            $map: {
              input: "$category",
              as: "category",
              in: {
                _id: "$$category._id",
                name: "$$category.name",
                slug: "$$category.slug",
              },
            },
          },
          0,
        ],
      },
      ratings: 1,
      brand: 1,
      defaultVariant: {
        $arrayElemAt: [
          {
            $map: {
              input: {
                $filter: {
                  input: "$variants",
                  as: "variant",
                  cond: {
                    $eq: ["$$variant.isDefault", true],
                  },
                },
              },
              as: "variant",
              in: {
                _id: "$$variant._id",
                price: "$$variant.price",
                stock: "$$variant.stock",
                image: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$$variant.images",
                            as: "image",
                            cond: {
                              $eq: ["$$image.isDefault", true],
                            },
                          },
                        },
                        as: "image",
                        in: {
                          url: "$$image.url",
                          alt: "$$image.alt",
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
          0,
        ],
      },
    },
  });

  if (minPrice || maxPrice) {
    pipeline.push({
      $match: {
        "defaultVariant.price": {
          ...(minPrice && { $gte: minPrice }),
          ...(maxPrice && { $lte: maxPrice }),
        },
      },
    });
  }

  pipeline.push({
    $sort: {
      [sortByField]: sortOrder === "asc" ? 1 : -1,
    },
  });

  pipeline.push({
    $skip: skip,
  });

  pipeline.push({
    $limit: limit,
  });

  try {
    const products = await Product.aggregate(pipeline);

    logger.info("Products fetched successfully.");
    return res.status(200).json(products);
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

    logger.info(`Product with id ${pid} deleted successfully.`);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await session.abortTransaction();

    logger.error(`Error deleting product with id ${pid}: `, error);
    return next(error);
  } finally {
    await session.endSession();
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

export const productRecommendations = async (req, res, next) => {
  const { id } = req.user;

  const { error, value } = validateRecommendations(req.query);

  if (error) return next(error);

  const { limit } = value;

  const categoriesPipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(`${id}`),
      },
    },
    {
      $unwind: {
        path: "$items",
      },
    },
    {
      $sortByCount: "$items.variant",
    },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "_id",
        as: "variant",
      },
    },
    {
      $unwind: {
        path: "$variant",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "variant.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
      },
    },
    {
      $sortByCount: "$product.category",
    },
    {
      $project: {
        category: "$_id",
        _id: 0,
      },
    },
    {
      $limit: Number(process.env.TOP_CATEGORIES_LIMIT),
    },
  ];

  const productsPipeline = [
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "product",
        as: "variants",
      },
    },
    {
      $group: {
        _id: "$category",
        products: {
          $addToSet: "$$ROOT",
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
      },
    },
    {
      $project: {
        category: {
          _id: 1,
          name: 1,
          description: 1,
          parent: 1,
          image: 1,
          level: 1,
          slug: 1,
        },
        prdoducts: {
          $map: {
            input: "$products",
            as: "product",
            in: {
              _id: "$$product._id",
              name: "$$product.name",
              slug: "$$product.slug",
              description: "$$product.description",
              rating: "$$product.rating",
              brand: "$$product.brand",
              defaultVariant: {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$$product.variants",
                          as: "variant",
                          cond: {
                            $eq: ["$$variant.isDefault", true],
                          },
                        },
                      },
                      as: "variant",
                      in: {
                        _id: "$$variant._id",
                        price: "$$variant.price",
                        stock: "$$variant.stock",
                        image: {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$$variant.images",
                                    as: "image",
                                    cond: {
                                      $eq: ["$$image.isDefault", true],
                                    },
                                  },
                                },
                                as: "image",
                                in: {
                                  url: "$$image.url",
                                  alt: "$$image.alt",
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },
  ];

  try {
    const topCategories = (await Order.aggregate(categoriesPipeline)).map(
      (item) => item.category
    );

    productsPipeline.unshift({
      $match: {
        category: {
          $in: topCategories.map(
            (category) => new mongoose.Types.ObjectId(`${category}`)
          ),
        },
      },
    });

    const recommendations = await Product.aggregate(productsPipeline);

    logger.info(`Fetched product recommendations for user ${id}.`);
    return res.status(200).json(recommendations);
  } catch (error) {
    logger.error(
      `Error fetching product recommendations for user ${id}: `,
      error
    );
    return next(error);
  }
};

export const relatedProducts = async (req, res, next) => {
  const { error, value } = validateRelatedProducts(req.query);

  if (error) return next(error);

  const { cid, limit } = value;

  const pipeline = [
    {
      $match: {
        category: new mongoose.Types.ObjectId(`${cid}`),
      },
    },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "product",
        as: "variants",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
        "description.short": 1,
        ratings: 1,
        brand: 1,
        category: {
          $arrayElemAt: [
            {
              $map: {
                input: "$category",
                as: "category",
                in: {
                  _id: "$$category._id",
                  name: "$$category.name",
                },
              },
            },
            0,
          ],
        },
        defaultVariant: {
          $arrayElemAt: [
            {
              $map: {
                input: {
                  $filter: {
                    input: "$variants",
                    as: "variant",
                    cond: {
                      $eq: ["$$variant.isDefault", true],
                    },
                  },
                },
                as: "variant",
                in: {
                  _id: "$$variant._id",
                  price: "$$variant.price",
                  stock: "$$variant.stock",
                  image: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$$variant.images",
                              as: "image",
                              cond: {
                                $eq: ["$$image.isDefault", true],
                              },
                            },
                          },
                          as: "image",
                          in: {
                            url: "$$image.url",
                            alt: "$$image.alt",
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $limit: limit,
    },
  ];
  try {
    const products = await Product.aggregate(pipeline);

    logger.info(`Fetched related products for category ${cid}.`);
    return res.status(200).json(products);
  } catch (error) {
    logger.error(
      `Error fetching related products for category ${cid}: `,
      error
    );
    return next(error);
  }
};
