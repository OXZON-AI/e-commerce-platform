import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk for subscribe to newsletter API request
export const subscribeToNewsletter = createAsyncThunk(
  "news/subscribe",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/news/subscribe", {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to subscribe for news letters!"
      );
    }
  }
);

// Async thunk for unsubscribe from newsletter API request
export const unsubscribeFromNewsletter = createAsyncThunk(
  "news/unsubscribe",
  async (subscribedToken, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("v1/news/unsubscribe", {
        token: subscribedToken,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          "Failed to unsubscribe from news letters!"
      );
    }
  }
);

// Initital state
const initialState = {
  status: "idle",
  isSubscribed: false,
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.status = "subscribe-loading";
        state.error = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state) => {
        state.status = "subscribe-success";
        state.isSubscribed = true;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.status = "subscribe-error";
        state.error = action.payload;
      })
      .addCase(unsubscribeFromNewsletter.pending, (state) => {
        state.status = "unsubscribe-loading";
        state.error = null;
      })
      .addCase(unsubscribeFromNewsletter.fulfilled, (state) => {
        state.status = "unsubscribe-success";
        state.isSubscribed = false;
      })
      .addCase(unsubscribeFromNewsletter.rejected, (state, action) => {
        state.status = "unsubscribe-error";
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;
