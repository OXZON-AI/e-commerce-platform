import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk for fetch cart items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/carts/");
      console.log("Cart Items slice: ", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart!");
    }
  }
);

// Async thunk for Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/carts/items", {
        variant: variantId,
        quantity,
      });
      console.log("add to cart in slice: ", response.data);

      return { variantId, quantity, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add item to cart!"
      );
    }
  }
);

// Async thunk for Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/v1/carts/items/${variantId}`, {
        quantity,
      });
      return { variantId, quantity, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update cart!");
    }
  }
);

// Async thunk for Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (variantId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `v1/carts/items/${variantId}`
      );
      return { variantId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove item from cart!"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { variantId, quantity } = action.payload;
        const existingItem = state.items.find(
          (item) => item.variant._id === variantId
        );
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.subTotal += quantity * existingItem.variant.price;
        } else {
          state.items.push({
            variant: { _id: variantId, price: 0 }, // price should be updated from backend
            quantity,
            subTotal: 0, // subtotal will be recalculated
          });
        }
        state.total += quantity * existingItem?.variant?.price || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { variantId, quantity } = action.payload;
        const item = state.items.find((item) => item.variant._id === variantId);
        if (item) {
          state.total += (quantity - item.quantity) * item.variant.price;
          item.quantity = quantity;
          item.subTotal = quantity * item.variant.price;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { variantId } = action.payload;
        state.items = state.items.filter(
          (item) => item.variant._id !== variantId
        );
        state.total = state.items.reduce((sum, item) => sum + item.subTotal, 0);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
