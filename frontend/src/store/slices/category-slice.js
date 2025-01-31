import { createReducer, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async Thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
  "product/catagories",
  async (_, rejectWithValue) => {
    try {
      const response = await axiosInstance.get("/v1/categories/");
      console.log(response.data.categories);
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Async Thunk for create categories

// Slice
const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories.";
      });
  },
});

export default categorySlice.reducer;
