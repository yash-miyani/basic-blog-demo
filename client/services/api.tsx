import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/`,
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.token = `${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default API;