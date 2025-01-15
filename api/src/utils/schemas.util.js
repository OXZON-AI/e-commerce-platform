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

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  name: Joi.string(),
  phone: Joi.string(),
});

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.object({
    short: Joi.string().required(),
    detailed: Joi.string(),
  }),
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category must be a valid ObjectId",
    }),
  brand: Joi.string().default("No brand"),
  variants: Joi.array()
    .items(
      Joi.object({
        attributes: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required(),
              value: Joi.string().required(),
            })
          )
          .min(1)
          .required(),
        price: Joi.number().min(0).less(Joi.ref("compareAtPrice")).required(),
        compareAtPrice: Joi.number().required(),
        images: Joi.array()
          .items(
            Joi.object({
              url: Joi.string().required(),
              alt: Joi.string(),
              isDefault: Joi.boolean(),
            })
          )
          .min(1)
          .required(),
        isDefault: Joi.boolean(),
      })
    )
    .min(1)
    .required(),
});
