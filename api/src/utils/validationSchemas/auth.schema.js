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
    .messages({ "string.pattern.base": `Phone number must have 7 digits.` })
});
