import mongoose from "mongoose";
import { Product } from "../../models/product.model.js";
import { logger } from "../../utils/logger.util.js";
import {
  validateRecommendations,
  validateRelatedProducts,
} from "../../utils/validator.util.js";
import { Order } from "../../models/order.model.js";

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
        products: {
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
