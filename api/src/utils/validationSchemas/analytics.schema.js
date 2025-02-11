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

export const salesPerformanceSchema = Joi.object({
  userType: Joi.string().trim().valid("customer", "guest"),
  status: Joi.string()
    .trim()
    .valid("pending", "processing", "shipped", "delivered", "cancelled"),
  interval: Joi.string()
    .trim()
    .valid("year", "month", "week", "day")
    .default("month"),
  startDate: Joi.date(),
  endDate: Joi.when("startDate", {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref("startDate")),
    otherwise: Joi.forbidden(),
  }),
});
