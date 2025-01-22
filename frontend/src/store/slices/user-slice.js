import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosConfig";

// Async thunk to update user details
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({userId, userData}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/v1/users/${userId}`, // Add user ID dynamically
        userData, // Send user data in the request body
        {
          headers: { "Content-Type": "application/json" },
        }
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

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {}, // Store the logged-in user data
    loading: false,
    error: null,
    success: false, // To track update success
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload; // Set user info on login
    },
    clearSuccess(state) {
      state.success = false; // Clear success state after update
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

export const { setUser, clearSuccess } = userSlice.actions;
export default userSlice.reducer;
