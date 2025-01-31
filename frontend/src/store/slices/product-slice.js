import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/products/", {
        params: filters,
      });
      console.log(response.data);
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

// Async thunk to fetch a product details
export const fetchProductDetails = createAsyncThunk(
  "product/fetchProductDetails",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/v1/products/${slug}`);
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

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    brands: [],
    productDetail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = [];
    },
    clearProductDetail: (state) => {
      state.productDetail = null;
    },
    clearBrands: (state) => {
      state.brands = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;

        //Exact unique brands only when products are fetched for the first time
        if (state.brands.length === 0) {
          const brandsSet = new Set(); // Set ensures each brand appears only once, removing duplicates.
          action.payload.forEach((product) => {
            if (product.brand) {
              brandsSet.add(product.brand.trim());
            }
          });
          state.brands = ["All Brands", ...Array.from(brandsSet)]; // Ensure "All Brands" is included
          console.log("brands: ", state.brands);
          
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts, clearProductDetail, clearBrands } = productSlice.actions;
export default productSlice.reducer;
