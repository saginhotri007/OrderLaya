import api from "../services/api";
import { Alert } from "react-native";

/** ==========================
 * 📌 DTOs & Types
 * ========================== */
export interface RestaurantDTO {
  restaurantID: number;
  userID: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  status: "Open" | "Closed";
  image: string;
}

export interface RestaurantPayload {
  RestaurantID?: number; // optional when creating
  UserID: number;
  Name: string;
  Description: string;
  Address: string;
  Phone: string;
  Status: "Open" | "Closed";
  Image?: string; // local file path (RN uri) or remote URL
}

/** ==========================
 * 📌 Services
 * ========================== */

/**
 * Fetch restaurants by user
 */
export const getRestaurants = async (userID: number): Promise<RestaurantDTO[]> => {
  try {
    const response = await api.get(`/restaurants/restaurants?userID=${userID}`);
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching restaurants:", error.message);
    Alert.alert("Error", "Failed to fetch restaurants");
    throw error;
  }
};

/**
 * Add a new restaurant
 */
export const addRestaurant = async (
  payload: RestaurantPayload
): Promise<RestaurantDTO | null> => {
  try {
    const formData = new FormData();
    formData.append("UserID", payload.UserID.toString());
    formData.append("Name", payload.Name);
    formData.append("Description", payload.Description);
    formData.append("Address", payload.Address);
    formData.append("Phone", payload.Phone);
    formData.append("Status", payload.Status);

    // ✅ Attach image if available
    if (payload.Image) {
      const fileName = `restaurant_${Date.now()}.jpg`; // unique name
      formData.append("Image", {
        uri: payload.Image,
        name: fileName,
        type: "image/jpeg",
      } as any);
    }

    const response = await api.post("/restaurants/restaurant", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      Alert.alert("Success", "Restaurant created successfully");
      return response.data.data as RestaurantDTO;
    } else {
      Alert.alert("Error", response.data.message || "Failed to create restaurant");
      return null;
    }
  } catch (error: any) {
    console.error("Error adding restaurant:", error.message);
    Alert.alert("Error", "Something went wrong while adding restaurant");
    return null;
  }
};

/**
 * Update existing restaurant
 */
export const updateRestaurant = async (
  id: number,
  payload: RestaurantPayload
): Promise<RestaurantDTO | null> => {
  try {
    const formData = new FormData();
    formData.append("UserID", payload.UserID.toString());
    formData.append("Name", payload.Name);
    formData.append("Description", payload.Description);
    formData.append("Address", payload.Address);
    formData.append("Phone", payload.Phone);
    formData.append("Status", payload.Status);
     formData.append("RestaurantID", payload.RestaurantID);
    // ✅ Always attach image if available
    if (payload.Image && payload.Image.startsWith("file://")) {
  formData.append("Image", {
    uri: payload.Image,
    name: `restaurant_${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);
}

console.log("Update payload:", formData);

    // ⚠️ Some servers don’t accept PUT for multipart
     const response = await api.put(`/restaurants/restaurant/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Update Response:", response.data);

    if (response.data.success) {
      Alert.alert("Success", "Restaurant updated successfully");
      return response.data.data as RestaurantDTO;
    } else {
      Alert.alert("Error", response.data.message || "Failed to update restaurant");
      return null;
    }
  } catch (error: any) {
    console.error("Error updating restaurant:", error.response?.data || error.message);
    Alert.alert("Error", "Something went wrong while updating restaurant");
    return null;
  }
};


/**
 * Delete restaurant
 */
export const deleteRestaurant = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/restaurants/restaurant/${id}`);
    if (response.data.success) {
      Alert.alert("Success", "Restaurant deleted successfully");
      return true;
    } else {
      Alert.alert("Error", response.data.message || "Failed to delete restaurant");
      return false;
    }
  } catch (error: any) {
    console.error("Error deleting restaurant:", error.message);
    Alert.alert("Error", "Something went wrong while deleting restaurant");
    return false;
  }
};
