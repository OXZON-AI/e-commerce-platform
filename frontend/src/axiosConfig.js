import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Ensure cookies are sent with requests
});

export default axiosInstance;