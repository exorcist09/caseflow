import axios from "axios";
import { useAuthStore } from "../state/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },

});


api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
