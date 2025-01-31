import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Ensure cookies are sent with requests
  timeout: 10000, // Set timeout to 10 seconds (10,000 ms)
});

export default axiosInstance;