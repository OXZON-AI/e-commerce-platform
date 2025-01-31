import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  parent: Joi.when("level", {
    is: Joi.equal(0),
    then: Joi.forbidden(),
    otherwise: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Parent category must be a valid ObjectId",
      }),
  }),
  image: Joi.object({
    url: Joi.string().uri().trim().required().messages({
      "string.empty": "Image url cannot be empty",
      "string.uri": "Image url must be a valid URI",
    }),
    alt: Joi.string().trim(),
  }),
  level: Joi.number().valid(0, 1, 2).default(0),
});

export const updateCategorySchema = Joi.object({
  cid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category id must be a valid ObjectId",
    }),
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  parent: Joi.when("level", {
    is: Joi.equal(0),
    then: Joi.forbidden(),
    otherwise: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Parent category must be a valid ObjectId",
      }),
  }),
  image: Joi.object({
    url: Joi.string().uri().trim().messages({
      "string.empty": "Image url cannot be empty",
      "string.uri": "Image url must be a valid URI",
    }),
    alt: Joi.string().trim(),
  }),
  level: Joi.number().valid(0, 1, 2),
});

export const deleteCategorySchema = Joi.object({
  cid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category id must be a valid ObjectId",
    }),
});
