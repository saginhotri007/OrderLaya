import api from "../services/api";

// Types
export interface MenuItem {
  itemID: number;
  restaurantID: number;
  categoryID: number;
  name: string;
  description: string;
  price: number;
  availability: boolean;
  imagePath?: string;
  variant?: string;
}

export interface Category {
  categoryID: number;
  name: string;
}

export interface Restaurant {
  restaurantID: number;
  name: string;
  userID: number;
}

export interface User {
  userID: number;
  role: string;
}

// 🔹 Fetch restaurants
export const fetchRestaurants = async (user: User): Promise<Restaurant[]> => {
  let res;
  if (user.role === "Admin") {
    res = await api.get("/restaurants");
  } else {
    res = await api.get(`/restaurants/restaurant?userID=${user.userID}`);
  }
  return res.data.data || [];
};

// 🔹 Fetch categories
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get("/menuitems/categories");
  return res.data.data || [];
};

// 🔹 Fetch menu items
export const fetchMenuItems = async (restaurantID: number): Promise<MenuItem[]> => {
  let url = "/menuitems/menuitems";
  if (restaurantID) {
    url += `?restaurantID=${restaurantID}`;
  }
  const res = await api.get(url);
  return res.data.data || [];
};

// 🔹 Save or update a menu item
export const saveMenuItem = async (formData: FormData, id: number) => {
  if (id === 0) {
    return await api.post("/menuitems/menuitem", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    return await api.put(`/menuitems/menuitem/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
};

// 🔹 Delete a menu item
export const deleteMenuItem = async (id: number) => {
  return await api.delete(`/menuitems/menuitem/${id}`);
};
