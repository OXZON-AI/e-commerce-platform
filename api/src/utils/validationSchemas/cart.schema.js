import Joi from "joi";

export const addToCartSchema = Joi.object({
  variant: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Variant must be a valid ObjectId",
    })
    .required(),
  quantity: Joi.number().min(1).required(),
});

export const removeFromCartSchema = Joi.object({
  vid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Variant must be a valid ObjectId",
    })
    .required(),
});

export const updateCartSchema = Joi.object({
  vid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Variant must be a valid ObjectId",
      "any.required": "Variant is required",
    })
    .required(),
  quantity: Joi.number().min(1).required(),
});
