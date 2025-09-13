// services/orderService.ts
import { Alert } from "react-native";
import api from "../services/api";

// ==========================
// 📌 DTOs & Types
// ==========================
export interface OrderItem {
  itemID: number;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "Preparing"
  | "Completed";

export interface Order {
  orderID: number;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  address: string;
  restaurantID?: number; // optional if returned by API
}

// ==========================
// 📌 Helper: Map API → Order
// ==========================
const mapOrder = (o: any): Order => ({
  orderID: o.orderID,
  customerName: o.customerName || "Guest",
  customerPhone: o.customerPhone || "",
  status: o.status as OrderStatus,
  total: o.totalAmount, // API field → total
  items: o.items || [],
  address: o.address || "Not Provided",
  restaurantID: o.restaurantID,
});

// ==========================
// 📌 Services
// ==========================

// 🔹 Fetch all orders (Admin)
export const fetchAllOrders = async (): Promise<Order[]> => {
  const res = await api.get("/Orders/Restaurantsorder");
  const rawOrders = res.data?.data || [];

  const mappedOrders: Order[] = rawOrders.map(mapOrder);

  // ✅ Remove duplicates
  const uniqueOrders = mappedOrders.filter(
    (order, index, self) =>
      index === self.findIndex((o) => o.orderID === order.orderID)
  );

  return uniqueOrders;
};

// 🔹 Fetch orders for a specific restaurant
export const fetchOrders = async (restaurantID: number): Promise<Order[]> => {
  const res = await api.get(
    `/Orders/Restaurantsorder?restaurantID=${restaurantID}`
  );
  const rawOrders = res.data?.data || [];

  const mappedOrders: Order[] = rawOrders.map(mapOrder);

  // ✅ Remove duplicates
  const uniqueOrders = mappedOrders.filter(
    (order, index, self) =>
      index === self.findIndex((o) => o.orderID === order.orderID)
  );

  return uniqueOrders;
};

// 🔹 Update order status
export const updateOrderStatus = async (
  orderID: number,
  status: OrderStatus
) => {
  return await api.post(`/Orders/UpdateStatus`, { orderID, status });
};

// 🔹 Delete an order (Admin only, optional)
export const deleteOrder = async (orderID: number) => {
  return await api.delete(`/Orders/${orderID}`);
};
