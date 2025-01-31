import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async Thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
  "product/categories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/categories/");
      console.log("categories: ", response.data.categories);
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
  loadingCategories: false,
  errorCategory: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategory = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategory = action.payload || "Failed to fetch categories.";
      });
  },
});

export default categorySlice.reducer;
