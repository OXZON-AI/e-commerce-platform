import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk to Create Variant
export const createVariant = createAsyncThunk(
  "variant/createVariant",
  async (variantData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/v1/products/${variantData.productId}/variants`,
        variantData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to Update Variant
export const updateVariant = createAsyncThunk(
  "variant/updateVariant",
  async ({ productId, variantId, ...updateData }, { rejectWithValue }) => {
    try {
      console.log("updated data in slice : ", updateData);
      const response = await axiosInstance.put(
        `/v1/products/${productId}/variants/${variantId}`,
        updateData
      );
      console.log("updated varien : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to Delete Variant
export const deleteVariant = createAsyncThunk(
  "variant/deleteVariant",
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/v1/products/${productId}/variants/${variantId}`
      );
      return variantId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const variantSlice = createSlice({
  name: "variant",
  initialState: {
    variants: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVariants: (state) => {
      state.variants = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.variants.push(action.payload);
      })
      .addCase(createVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.variants = state.variants.map((variant) =>
          variant._id === action.payload._id ? action.payload : variant
        );
      })
      .addCase(updateVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.variants = state.variants.filter(
          (variant) => variant._id !== action.payload
        );
      })
      .addCase(deleteVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVariants } = variantSlice.actions;
export default variantSlice.reducer;
