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
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

export const updateStatusSchema = Joi.object({
  oid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Order id must be a valid ObjectId",
    }),
  user: Joi.when("isGuest", {
    is: Joi.equal(false),
    then: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "User id must be a valid ObjectId",
      })
      .required(),
    otherwise: Joi.forbidden(),
  }),
  isGuest: Joi.boolean().required(),
  status: Joi.string()
    .trim()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});

export const cancelOrderSchema = Joi.object({
  oid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Order id must be a valid ObjectId",
    }),
});
