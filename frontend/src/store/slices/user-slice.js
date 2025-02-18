import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";
import Cookie from "js-cookie";

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/auth/signin", {
        email,
        password,
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed!");
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ email, password, name, phone, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/auth/signup", {
        email,
        password,
        name,
        phone,
        token,
      });

      console.log("User-slice Register : ", response.data.message);

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed!"
      );
    }
  }
);

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

// Async thunk to signout user
export const signoutUser = createAsyncThunk(
  "user/signout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.get("/v1/auth/signout");
      console.log("User-slice signout : ", response.data.message);
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      dispatch(clearUser()); // Explicitly reset Redux state
      Cookie.remove("token"); // Remove token from cookies
      localStorage.removeItem("persist:frontend"); // Remove Redux persist
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
      state.userInfo = action.payload; // Set user info ex: on login
    },
    clearUser(state) {
      state.userInfo = null; // Clear user data
    },
    clearSuccess(state) {
      state.success = false; // Clear success state ex: after update
    },
    clearError: (state) => {
      state.error = null; // Clear error state ex: after update
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(signoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.userInfo = null; // Clear user info
      })
      .addCase(signoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, clearSuccess, clearError } =
  userSlice.actions;
export default userSlice.reducer;
