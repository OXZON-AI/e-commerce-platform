import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/v1/users", {
        params: filters,
      });
      console.log("users: ", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/v1/users/${id}`);
      return id; // Return the deleted user's ID
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Slice
const adminUserSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear error state after update
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users.";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      });
  },
});

export const { clearError } = adminUserSlice.actions;
export default adminUserSlice.reducer;
