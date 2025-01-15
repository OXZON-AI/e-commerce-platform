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
              name: Joi.string().required(),
              value: Joi.string().required(),
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
