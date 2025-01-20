import Joi from "joi";

export const createReviewSchema = Joi.object({
  variant: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Variant id must be a valid ObjectId",
    }),
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "User id must be a valid ObjectId",
    }),
  order: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Order id must be a valid ObjectId",
    }),
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().trim().required(),
  comment: Joi.string().trim().required(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().trim().required().messages({
        "string.empty": "Image url cannot be empty",
        "string.uri": "Image url must be a valid URI",
      }),
      alt: Joi.string().trim(),
    })
  ),
});
