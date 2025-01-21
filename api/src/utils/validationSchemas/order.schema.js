import Joi from "joi";

export const getOrdersSchema = Joi.object({
  customer: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Cutomer id must be a valid ObjectId",
    }),
  guestOnly: Joi.when("customer", {
    is: Joi.exist(),
    then: Joi.boolean().valid(false),
    otherwise: Joi.boolean().default(false),
  }),
  status: Joi.string()
    .trim()
    .valid("pending", "processing", "shipped", "delivered", "cancelled"),
  sortBy: Joi.string().trim().valid("total", "date"),
  sortOrder: Joi.when("sortBy", {
    is: Joi.exist(),
    then: Joi.string().trim().valid("asc", "desc"),
    otherwise: Joi.forbidden(),
  }),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
});

export const updateStatusSchema = Joi.object({
  oid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Order id must be a valid ObjectId",
    }),
  status: Joi.string()
    .trim()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});
