import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk to update user details
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/v1/users/${userId}`, // Add user ID dynamically
        userData // Send user data in the request body
      );

      return response.data.user; // Return updated user info
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  userInfo: null, // Store the logged-in user data
  loading: false,
  error: null,
  success: false, // Track success state
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload; // Set user info on login
    },
    clearUser(state) {
      state.userInfo = null; // Clear user data
    },
    clearSuccess(state) {
      state.success = false; // Clear success state after update
    },
    clearError: (state) => {
      state.error = null; // Clear error state after update
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userInfo = action.payload; // Update user info with response
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, clearSuccess, clearError } =
  userSlice.actions;
export default userSlice.reducer;
