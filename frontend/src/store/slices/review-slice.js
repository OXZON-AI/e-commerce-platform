import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/v1/reviews/${slug}`);
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
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/v1/reviews/`, reviewData);
      console.log("Post-review-slice : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create review!"
      );
    }
  }
);
