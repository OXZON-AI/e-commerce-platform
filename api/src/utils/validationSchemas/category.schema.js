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
