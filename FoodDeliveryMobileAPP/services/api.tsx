// services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://122.161.67.38:44350/api"; // For Android emulator. Use IP for real devices.

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token unless it's a login request
api.interceptors.request.use(async (config) => {
  if (config.url?.includes("/auth/login")) {
    return config;
  }

  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer ${token}";
  }

  return config;
});

export default api;
