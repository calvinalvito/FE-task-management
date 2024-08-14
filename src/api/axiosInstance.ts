import axios from "axios";
import dotenv from 'dotenv';


dotenv.config();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
