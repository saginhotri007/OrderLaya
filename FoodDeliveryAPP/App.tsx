import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./services/AuthContext";
import { CartProvider } from "./components/CartContext";

export default function App() {
  return (
     <AuthProvider>
      <CartProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
