import Joi from "joi";

export const salesSummarySchema = Joi.object({
  userType: Joi.string().trim().valid("customer", "guest"),
  status: Joi.string()
    .trim()
    .valid("pending", "processing", "shipped", "delivered", "cancelled"),
  startDate: Joi.date(),
  endDate: Joi.when("startDate", {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref("startDate")),
    otherwise: Joi.forbidden(),
  }),
});
