import mongoose from "mongoose";
import { Product } from "../../models/product.model.js";
import { Variant } from "../../models/variant.model.js";
import { logger } from "../../utils/logger.util.js";
import {
  validateCreateProduct,
  validateDeleteProduct,
  validateGetProduct,
  validateGetProducts,
  validateUpdateProduct,
} from "../../utils/validator.util.js";
import { customError } from "../../utils/error.util.js";

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
  const { role } = req.user;
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
          _id: 1,
          attributes: 1,
          price: 1,
          compareAtPrice: 1,
          stock: 1,
          images: 1,
          isDefault: 1,
          sku: 1,
          ...(role === "admin" && { cost: 1 }),
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

  if (sortBy) {
    const sortByField =
      sortBy === "ratings" ? "ratings.average" : "defaultVariant.price";
    pipeline.push({
      $sort: {
        [sortByField]: sortOrder === "asc" ? 1 : -1,
      },
    });
  }

  pipeline.push({
    $skip: skip,
  });

  pipeline.push({
    $limit: limit,
  });

  pipeline.push({
    $facet: {
      products: [],
      count: [{ $count: "totalCount" }],
    },
  });

  pipeline.push({
    $project: {
      products: 1,
      paginationInfo: {
        totalCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$count.totalCount", 0],
            },
            0,
          ],
        },
        totalPages: {
          $ceil: {
            $divide: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: ["$count.totalCount", 0],
                  },
                  0,
                ],
              },
              limit,
            ],
          },
        },
      },
    },
  });

  try {
    const result = await Product.aggregate(pipeline);

    const { products, paginationInfo } = result[0];

    logger.info("Products fetched successfully.");
    return res.status(200).json({
      products,
      paginationInfo,
    });
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
