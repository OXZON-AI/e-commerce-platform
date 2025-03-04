import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ productSlug, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/v1/reviews/${productSlug}`, {
        params: filters,
      });
      console.log("Fetch-reviews-slice : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews!"
      );
    }
  }
);

// Async thunk for creating a review
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/v1/reviews/`, reviewData);
      console.log("Post-review-slice : ", response.data);

      dispatch(fetchReviews(reviewData.slug)); // Refetch reviews to update.
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create review!"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    counts: {},
    reviewsPaginationInfo: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // handling states for fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.counts = action.payload.counts;
        state.reviewsPaginationInfo = action.payload.paginationInfo;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // handling states for create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
