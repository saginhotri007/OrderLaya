import { AddressDTO, OrderItem } from "../services/orderService";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cart: { id: string };
  AddAddress: {
    id: string;
    cartItems: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  Checkout: {
    id: string;
    cartItems: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    address: AddressDTO;
  };
  OrderConfirmation: { orderID: number };
};
