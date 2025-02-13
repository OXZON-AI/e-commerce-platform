import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^[0-9]{7}$/)
    .required()
    .messages({ "string.pattern.base": `Phone number must have 7 digits.` }),
  subject: Joi.string().trim().required(),
  inquiry: Joi.string().trim().required(),
});
