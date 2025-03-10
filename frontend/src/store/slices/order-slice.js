import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/orders/", {
        params: filters,
      });
      console.log("orders-slice : ", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get orders"
      );
    }
  }
);

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ oid, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/v1/orders/${oid}`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// Async thunk to cancel order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (oid, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/v1/orders/${oid}/cancel`,
        {}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

const initialState = {
  orders: [],
  paginationInfo: {},
  selectedOrder: null, // this is for store selected order details
  status: "idle",
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload; // Store selected order in Redux
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "fetch-loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "fetch-succeeded";
        state.orders = action.payload.orders;
        state.paginationInfo = action.payload.paginationInfo;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "fetch-failed";
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = "update-loading";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = "update-succeeded";
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = "update-failed";
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.status = "cancelOrder-loading";
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.status = "cancelOrder-succeeded";
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = "cancelOrder-failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions; // export action

export default orderSlice.reducer;
