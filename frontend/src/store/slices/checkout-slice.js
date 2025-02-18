import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk for processing checkout
export const processCheckout = createAsyncThunk(
  "checkout/processCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/checkout/process", {});

      return response.data.paymentUrl; // Return the Stripe checkout URL
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Checkout failed"
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.loading = false;
        window.location.href = action.payload; // Redirect to Stripe checkout
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckoutError } = checkoutSlice.actions;
export default checkoutSlice.reducer;
