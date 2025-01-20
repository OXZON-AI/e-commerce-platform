import Joi from "joi";

export const completeCheckoutSchema = Joi.object({
  session_id: Joi.string().trim().required(),
});
