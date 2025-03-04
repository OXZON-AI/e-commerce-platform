import Joi from "joi";

export const subscribeSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const publishSchema = Joi.object({
  title: Joi.string().trim().required(),
  body: Joi.string().trim().required(),
  image: Joi.string().uri().trim().required(),
});

export const unsubscribeSchema = Joi.object({
  token: Joi.string().trim().required(),
});

export const getNewsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  sortBy: Joi.string().trim().valid("date"),
  sortOrder: Joi.when("sortBy", {
    is: Joi.exist(),
    then: Joi.string().trim().valid("asc", "desc"),
    otherwise: Joi.forbidden(),
  }),
});
