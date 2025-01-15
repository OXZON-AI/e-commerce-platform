import {
  requestResetSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  updateUserSchema,
} from "./validationSchemas/auth.schema.js";
import {
  createProductSchema,
  deleteProductSchema,
  deleteVariantSchema,
} from "./validationSchemas/product.schema.js";

const validate = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false });
};

export const validateSignup = validate(signupSchema);
export const validateSignin = validate(signinSchema);
export const validateRequestReset = validate(requestResetSchema);
export const validatePasswordReset = validate(resetPasswordSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateCreateProduct = validate(createProductSchema);
export const validateDeleteProduct = validate(deleteProductSchema);
export const validateDeleteVariant = validate(deleteVariantSchema);
