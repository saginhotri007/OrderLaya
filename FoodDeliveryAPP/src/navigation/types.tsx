import { AddressDTO, OrderItem } from "../../services/orderService";
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AdminDashboard: undefined;
  Restaurant: undefined;
  Category: undefined;
  Cart: undefined;
  ManageRest:undefined;
  Dashboard:undefined;
  AddMenuItem:undefined;
  ResOwnerOrder:undefined;
  AddAddress: {
    id: string;
    cartItems: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  Order: {
    id: string;
    cartItems: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    address: AddressDTO;
  };
};
