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

// Async thunk to fetch all orders separately [Ex: for all order export as excel file]
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/orders/", {
        params: filters,
      });
      console.log("all-orders-slice : ", response.data);

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
  async ({ oid, status, isGuest, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/v1/orders/${oid}`, {
        status,
        isGuest,
        user: userId,
      });
      console.log("updatee-order-status-slice : ", response.data.order);
      return response.data.order;
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

  // For all orders for excel download
  allOrderStatus: "idle",
  allOrdersPaginationInfo: {},
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload; // Store selected order in Redux
    },
    // Reset orders state to initial state
    resetOrders: (state) => {
      return initialState; // Reset state to initial state
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
      .addCase(fetchAllOrders.pending, (state) => {
        state.allOrderStatus = "fetch-loading";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrderStatus = "fetch-succeeded";
        state.allOrdersPaginationInfo = action.payload.paginationInfo;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.allOrderStatus = "fetch-failed";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = "update-loading";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = "update-succeeded";

        // Update selectedOrder status when status is changed
        if (
          state.selectedOrder &&
          state.selectedOrder._id === action.payload._id
        ) {
          state.selectedOrder.status = action.payload.status; // Update only the status field
        }

        // Update order in the orders list
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id
            ? {
                ...order,
                status: action.payload.status,
                updatedAt: action.payload.updatedAt,
              }
            : order
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

export const { setSelectedOrder, resetOrders } = orderSlice.actions; // export action

export default orderSlice.reducer;
