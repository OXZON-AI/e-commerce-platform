import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.object({
    short: Joi.string().required(),
    detailed: Joi.string(),
  }),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category must be a valid ObjectId",
    }),
  brand: Joi.string().default("No brand"),
  variants: Joi.array()
    .items(
      Joi.object({
        attributes: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().lowercase().required(),
              value: Joi.string().lowercase().required(),
            })
          )
          .min(1)
          .required(),
        price: Joi.number().min(0).less(Joi.ref("compareAtPrice")).required(),
        compareAtPrice: Joi.number().required(),
        images: Joi.array()
          .items(
            Joi.object({
              url: Joi.string().required(),
              alt: Joi.string(),
              isDefault: Joi.boolean(),
            })
          )
          .min(1)
          .required(),
        isDefault: Joi.boolean(),
      })
    )
    .min(1)
    .required(),
});

export const getProductSchema = Joi.object({
  slug: Joi.string().required(),
});

export const getProductsSchema = Joi.object({
  search: Joi.string(),
  category: Joi.string(),
  brand: Joi.string(),
  sortBy: Joi.string().valid("ratings", "price"),
  sortOrder: Joi.string().valid("asc", "desc"),
  minPrice: Joi.when("maxPrice", {
    is: Joi.exist(),
    then: Joi.number().less(Joi.ref("maxPrice")),
    otherwise: Joi.number().min(1),
  }),
  maxPrice: Joi.number().min(1),
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

export const updateProductSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  name: Joi.string(),
  description: Joi.object({
    short: Joi.string(),
    detailed: Joi.string(),
  }),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Category must be a valid ObjectId",
    }),
  brand: Joi.string(),
});

export const deleteProductSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
});

export const createVariantSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  attributes: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().lowercase().required(),
        value: Joi.string().lowercase().required(),
      })
    )
    .min(1)
    .required(),
  price: Joi.number().min(0).less(Joi.ref("compareAtPrice")).required(),
  compareAtPrice: Joi.number().required(),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        alt: Joi.string(),
        isDefault: Joi.boolean(),
      })
    )
    .min(1)
    .required(),
  isDefault: Joi.boolean(),
});

export const updateVariantSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  vid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Variant id must be a valid ObjectId",
    }),
  toAdd: Joi.object({
    attributes: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().lowercase().required(),
          value: Joi.string().lowercase().required(),
        })
      )
      .default([]),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().required(),
          alt: Joi.string(),
          isDefault: Joi.boolean(),
        })
      )
      .default([]),
  }),
  toChange: Joi.object({
    attributes: Joi.array().items(
      Joi.object({
        name: Joi.string().lowercase().required(),
        value: Joi.string().lowercase().required(),
        id: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Attribute id must be a valid ObjectId",
          }),
      })
    ),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required(),
        alt: Joi.string(),
        isDefault: Joi.boolean(),
        id: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Image id must be a valid ObjectId",
          }),
      })
    ),
  }),
  toRemove: Joi.object({
    attributes: Joi.array()
      .items(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Attribute id must be a valid ObjectId",
          })
      )
      .default([]),
    images: Joi.array()
      .items(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "Image id must be a valid ObjectId",
          })
      )
      .default([]),
  }),
  price: Joi.number().min(0).less(Joi.ref("compareAtPrice")),
  compareAtPrice: Joi.number(),
  isDefault: Joi.boolean(),
});

export const deleteVariantSchema = Joi.object({
  pid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Product id must be a valid ObjectId",
    }),
  vid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Variant id must be a valid ObjectId",
    }),
});
