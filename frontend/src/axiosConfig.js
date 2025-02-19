import axios from "axios";
import { signoutUser } from "./store/slices/user-slice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Ensure cookies are sent with requests
  timeout: 50000, // Set timeout to 10 seconds (10,000 ms)
});

// Axios Response Interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Unauthorized request detected. Logging out...");
      const { store } = require("./store/store"); // Lazy-load store
      store.dispatch(signoutUser()); // Dispatch logout action on 401
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
