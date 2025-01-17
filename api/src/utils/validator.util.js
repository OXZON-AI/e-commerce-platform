import {
  requestResetSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  updateUserSchema,
} from "./validationSchemas/auth.schema.js";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartSchema,
} from "./validationSchemas/cart.schema.js";
import { createCategorySchema } from "./validationSchemas/category.schema.js";
import {
  createProductSchema,
  createVariantSchema,
  deleteProductSchema,
  deleteVariantSchema,
  getProductSchema,
  getProductsSchema,
  updateProductSchema,
  updateVariantSchema,
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
export const validateGetProduct = validate(getProductSchema);
export const validateGetProducts = validate(getProductsSchema);
export const validateUpdateProduct = validate(updateProductSchema);
export const validateDeleteProduct = validate(deleteProductSchema);
export const validateCreateVariant = validate(createVariantSchema);
export const validateUpdateVariant = validate(updateVariantSchema);
export const validateDeleteVariant = validate(deleteVariantSchema);
export const validateCreateCategory = validate(createCategorySchema);
export const validateAddToCart = validate(addToCartSchema);
export const validateRemoveFromCart = validate(removeFromCartSchema);
