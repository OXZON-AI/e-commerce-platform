import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  parent: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Parent category must be a valid ObjectId",
    }),
  image: Joi.object({
    url: Joi.string().required(),
    alt: Joi.string(),
  }),
  level: Joi.number().default(0),
});
