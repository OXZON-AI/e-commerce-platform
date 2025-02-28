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
      console.log("product-slice : ", response.data);

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
  async (slug, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearProductDetail()); // clears previous product details
      const response = await axiosInstance.get(`/v1/products/${slug}`);
      console.log("product-details-slice : ", response.data);

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

// Async thunk to create Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/products/", productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/v1/products/${productId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/v1/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to get related product
export const fetchRelatedProducts = createAsyncThunk(
  "product/relatedProduct",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/products/related/", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed Retrive Related Product Details!"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    relatedProducts: [],
    pagination: { page: 1, totalPages: 1 },
    brands: [],
    productDetail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = [];
      state.pagination = { page: 1, totalPages: 1 };
    },
    clearProductDetail: (state) => {
      state.productDetail = null;
    },
    clearBrands: (state) => {
      state.brands = [];
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.paginationInfo;
        console.log(
          "pagination-product-slice: ",
          action.payload.paginationInfo
        );
        console.log("brand-action-load: ", action.payload.products);

        //Exact unique brands only when products are fetched for the first time
        if (state.brands.length === 0) {
          const brandsSet = new Set(); // Set ensures each brand appears only once, removing duplicates.
          action.payload.products.forEach((product) => {
            if (product.brand) {
              brandsSet.add(product.brand.trim());
            }
          });
          state.brands = ["All Brands", ...Array.from(brandsSet)]; // Ensure "All Brands" is included
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
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRelatedProducts.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProducts,
  clearProductDetail,
  clearBrands,
  clearProductError,
} = productSlice.actions;
console.log("Exporting Product Reducer:", productSlice.reducer);
export default productSlice.reducer;
