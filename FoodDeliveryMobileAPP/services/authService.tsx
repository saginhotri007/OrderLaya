import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { Alert } from "react-native";
import axios from "axios";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    phone?: string;
    // add more fields as needed
  };
}

const BASE_URL = "http://122.161.67.38:7205/api";

export const login = async (phone: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, {
      phone,
      password,
    });
    await AsyncStorage.setItem("token", response.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
  

};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};
