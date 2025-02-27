import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().trim().required(),
  phone: Joi.string()
    .regex(/^[0-9]{7}$/)
    .required()
    .messages({ "string.pattern.base": `Phone number must have 7 digits.` }),
  token: Joi.string().required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rememberMe: Joi.boolean().default(false),
});

export const requestResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  name: Joi.string().trim(),
  phone: Joi.string()
    .regex(/^[0-9]{7}$/)
    .messages({ "string.pattern.base": `Phone number must have 7 digits.` }),
});

export const getUsersSchema = Joi.object({
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "User id must be a valid ObjectId",
    }),
  userType: Joi.string().trim().valid("admin", "customer").default("customer"),
  sortBy: Joi.string().trim().valid("points", "date"),
  sortOrder: Joi.when("sortBy", {
    is: Joi.exist(),
    then: Joi.string().trim().valid("asc", "desc"),
    otherwise: Joi.forbidden(),
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

export const deleteUserSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "User id must be a valid ObjectId",
    }),
});
