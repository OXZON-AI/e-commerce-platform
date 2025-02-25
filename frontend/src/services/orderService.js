import axios from "axios";

const API_URL = "/api/orders"; // Adjust this if changes

export const getOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.patch(`${API_URL}/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw error;
  }
};
