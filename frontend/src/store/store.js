import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import productReducer from "./slices/product-slice";
import currencyReducer from "./slices/currency-slice";
import cartReducer from "./slices/cart-slice";
import compareReducer from "./slices/compare-slice";
import wishlistReducer from "./slices/wishlist-slice";
import userReducer from "./slices/user-slice";
import adminUserReducer from "./slices/admin-user-slice";
import categoryReducer from "./slices/category-slice";
import variantReducer from "./slices/variant-slice";
import checkoutReducer from "./slices/checkout-slice";

const persistConfig = {
  key: "frontend",
  version: 1.1,
  storage,
  whitelist: ["user", "cart"], // Only persist necessary slices
};

export const rootReducer = combineReducers({
  product: productReducer,
  currency: currencyReducer,
  cart: cartReducer,
  compare: compareReducer,
  wishlist: wishlistReducer,
  user: userReducer,
  users: adminUserReducer,
  categories: categoryReducer,
  variant: variantReducer,
  checkout: checkoutReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);