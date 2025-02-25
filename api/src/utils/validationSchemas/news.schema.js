import Joi from "joi";

export const subscribeSchema = Joi.object({
  email: Joi.string().email().required(),
});
