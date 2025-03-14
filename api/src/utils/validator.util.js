import {
  categoryPerformanceSchema,
  salesPerformanceSchema,
  salesSummarySchema,
} from "./validationSchemas/analytics.schema.js";
import {
  deleteUserSchema,
  getUsersSchema,
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
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "./validationSchemas/category.schema.js";
import { completeCheckoutSchema } from "./validationSchemas/checkout.schema.js";
import { contactSchema } from "./validationSchemas/contact.schema.js";
import {
  getNewsSchema,
  publishSchema,
  subscribeSchema,
  unsubscribeSchema,
} from "./validationSchemas/news.schema.js";
import {
  cancelOrderSchema,
  getOrdersSchema,
  updateStatusSchema,
} from "./validationSchemas/order.schema.js";
import {
  createProductSchema,
  createVariantSchema,
  deleteProductSchema,
  deleteVariantSchema,
  getProductSchema,
  getProductsSchema,
  recommendationsSchema,
  relatedProductsSchema,
  updateProductSchema,
  updateVariantSchema,
} from "./validationSchemas/product.schema.js";
import {
  createReviewSchema,
  getReviewsSchema,
} from "./validationSchemas/review.schema.js";

const validate = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false });
};

export const validateSignup = validate(signupSchema);
export const validateSignin = validate(signinSchema);
export const validateRequestReset = validate(requestResetSchema);
export const validatePasswordReset = validate(resetPasswordSchema);

export const validateUpdateUser = validate(updateUserSchema);
export const validateGetUsers = validate(getUsersSchema);
export const validateDeleteUser = validate(deleteUserSchema);

export const validateCreateProduct = validate(createProductSchema);
export const validateGetProduct = validate(getProductSchema);
export const validateGetProducts = validate(getProductsSchema);
export const validateUpdateProduct = validate(updateProductSchema);
export const validateDeleteProduct = validate(deleteProductSchema);

export const validateCreateVariant = validate(createVariantSchema);
export const validateUpdateVariant = validate(updateVariantSchema);
export const validateDeleteVariant = validate(deleteVariantSchema);

export const validateCreateCategory = validate(createCategorySchema);
export const validateUpdateCategory = validate(updateCategorySchema);
export const validateDeleteCategory = validate(deleteCategorySchema);
export const validateAddToCart = validate(addToCartSchema);
export const validateRemoveFromCart = validate(removeFromCartSchema);
export const validateUpdateCart = validate(updateCartSchema);

export const validateCompleteCheckout = validate(completeCheckoutSchema);

export const validateCreateReview = validate(createReviewSchema);
export const validateGetReviews = validate(getReviewsSchema);

export const validateGetOrders = validate(getOrdersSchema);
export const validateUpdateStatus = validate(updateStatusSchema);
export const validateCancelOrder = validate(cancelOrderSchema);

export const validateRecommendations = validate(recommendationsSchema);
export const validateRelatedProducts = validate(relatedProductsSchema);

export const validateSalesSummary = validate(salesSummarySchema);
export const validateSalesPerformance = validate(salesPerformanceSchema);
export const validateCategoryPerformance = validate(categoryPerformanceSchema);

export const validateContact = validate(contactSchema);

export const validateSubscribe = validate(subscribeSchema);
export const validatePublish = validate(publishSchema);
export const validateUnsubscribe = validate(unsubscribeSchema);
export const validateGetNews = validate(getNewsSchema);
