import api from "../services/api";
import { Alert } from "react-native";

export interface AddressDTO {
  addressID: number;
  userID: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  pincode: string;
}

export interface OrderItem {
  itemID: number;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface CreateOrderRequest {
  userID: number;
  address: AddressDTO; // Use AddressDTO here
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  RestaurantID:number;
}

export interface CreateOrderResponse {
  orderID: number;
  message: string;
  success: boolean;
}

export const saveUserAddress = async (address: AddressDTO): Promise<AddressDTO | null> => {
  try {
    const response = await api.post("/Orders/Address", address);
console.log(response);
    if (response.data.success==true) {
      Alert.alert("Success", response.data.message || "Address saved successfully");
      return response.data.data as AddressDTO;
    } else {
      Alert.alert("Error", "Failed to save address");
      return null;
    }
  } catch (error: any) {
    console.log("Error saving address:", error.message);
    Alert.alert("Error", "Something went wrong while saving the address");
    return null;
  }
};
export const placeOrder = async (order: CreateOrderRequest): Promise<CreateOrderResponse> => {
  try {
    const response = await api.post<CreateOrderResponse>("/orders/CreateOrder", order);
    return response.data;
  } catch (error: any) {
    console.log("Error placing order:", error.message);
    Alert.alert("Error", "Failed to place order");
    throw error;
  }
};

/**
 * Fetch all orders for the logged-in user
 */
export const getUserOrders = async (userID: number) => {
  try {
    const response = await api.get(`/orders/user/${userID}`);
    return response.data;
  } catch (error: any) {
    console.log("Error fetching orders:", error.message);
    Alert.alert("Error", "Failed to fetch orders");
    throw error;
  }
};

/**
 * Get order details by ID
 */
export const getOrderById = async (orderID: number) => {
  try {
    const response = await api.get(`/orders/${orderID}`);
    return response.data;
  } catch (error: any) {
    console.log("Error fetching order:", error.message);
    Alert.alert("Error", "Failed to fetch order details");
    throw error;
  }
};
