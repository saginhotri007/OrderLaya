import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/User/HomeScreen";
import AdminDashboard from "../screens/Admin/AdminDashboard";
import RestaurantsItem from "../screens/User/RestaurantScreen";
import CategoryScreen from "../screens/User/CategoryScreen";
import { RootStackParamList } from "./types";
import CartScreen from "../screens/User/CartScreen";
import AddAddressScreen from "../screens/User/AddAddressScreen";
import OrdersScreen from "../screens/User/OrdersScreen";
import ManageRestaurantScreen from "../screens/Admin/ManageRestaurants";
import DashboardScreen from "../screens/RestaurantOwner/DashboardScreen";
import AddMenuItemScreen from "../screens/RestaurantOwner/AddMenuItemScreen";
import OrderScreen from "../screens/RestaurantOwner/OrdersScreen";
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Restaurant" component={RestaurantsItem} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
        <Stack.Screen name="Order" component={OrdersScreen} />
        <Stack.Screen name="ManageRest" component={ManageRestaurantScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AddMenuItem" component={AddMenuItemScreen} />
        <Stack.Screen name="ResOwnerOrder" component={OrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
