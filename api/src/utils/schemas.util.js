import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  token: Joi.string().required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const requestResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});
