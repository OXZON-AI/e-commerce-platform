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
export const createCategory = createAsyncThunk(
  "product/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/v1/categories/",
        categoryData
      );
      console.log("created category : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Async Thunk for updating a category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ cid, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/v1/categories/${cid}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Async Thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (cid, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/v1/categories/${cid}`);
      return cid;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

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
      })
      .addCase(createCategory.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategory = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategory = action.payload || "Failed to create category.";
      })
      .addCase(updateCategory.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategory = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loadingCategories = false;
        const updatedCategory = action.payload;
        state.categories = state.categories.map((category) =>
          category._id === updatedCategory._id ? updatedCategory : category
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategory = action.payload || "Failed to update category.";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategory = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategory = action.payload || "Failed to delete category.";
      });
  },
});

export default categorySlice.reducer;
