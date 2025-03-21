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
        error.response?.data?.message || "Failed Retrive Related Products!"
      );
    }
  }
);

// Async thunk to get recommend products
export const fetchRecommendProducts = createAsyncThunk(
  "peoduct/recommendProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("v1/products/recommendations/");
      console.log("Recommed-Products-slice : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed Retrive Recommend Products!"
      );
    }
  }
);

// Async thunk to get all brands from using fetchAllProducts endpoint
export const fetchBrands = createAsyncThunk(
  "product/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch the first page to get totalPages
      const firstResponse = await axiosInstance.get("/v1/products/", {
        params: { page: 1 },
      });

      const { products, paginationInfo } = firstResponse.data;
      const totalPages = paginationInfo.totalPages;

      // If only one page, return brands immediately
      if (totalPages === 1) {
        const uniqueBrands = extractUniqueBrands(products);
        return ["All Brands", ...uniqueBrands];
      }

      // Create an array of promises to fetch all pages
      const requests = [];
      for (let page = 2; page <= totalPages; page++) {
        requests.push(axiosInstance.get("/v1/products/", { params: { page } }));
      }

      // Fetch all remaining pages in parallel
      const responses = await Promise.all(requests);

      // Combine all products from all pages
      const allProducts = responses.flatMap((res) => res.data.products);
      allProducts.push(...products); // Include first page products

      // Extract unique brands
      const uniqueBrands = extractUniqueBrands(allProducts);

      return ["All Brands", ...uniqueBrands];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Helper function to extract unique brands
const extractUniqueBrands = (products) => {
  const brandsSet = new Set();
  products.forEach((product) => {
    if (product.brand) {
      brandsSet.add(product.brand.trim());
    }
  });
  return Array.from(brandsSet);
};

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    relatedProducts: [],
    recommendProducts: [],
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
    // extraReducers is used to handle actions generated by createAsyncThunk.
    builder // builder is a function that helps define different states based on the action's lifecycle (pending, fulfilled, rejected).
      // For Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.paginationInfo;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // For Fetch Product Details
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
      // For Create Product
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
      // For Update Product
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
      // For Delete Product
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
      // For Related Products
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
      })
      // For Recommend Products
      .addCase(fetchRecommendProducts.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRecommendProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendProducts = action.payload;
      })
      .addCase(fetchRecommendProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // For fetch all brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
        console.log("All-brands-product-slice : ", action.payload);
      })
      .addCase(fetchBrands.rejected, (state, action) => {
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
