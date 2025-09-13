// src/screens/Restaurant/RestaurantDashboard.tsx
import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image 
} from "react-native";
import profileImg from "../../assets/profile.jpg"; // replace with dynamic image later

const RestaurantDashboard = ({ navigation }: any) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const restaurantName = "My Restaurant"; // later fetch from auth/profile

  const handleLogout = () => {
    setDropdownVisible(false);
    // 🔑 Clear session here
    navigation.replace("LoginScreen");
  };

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Restaurant Dashboard</Text>

        {/* Profile Button */}
        <View>
          <TouchableOpacity 
            style={styles.profileBtn} 
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Image source={profileImg} style={styles.profileImage} />
            <Text style={styles.profileText}>{restaurantName}</Text>
          </TouchableOpacity>

          {/* Dropdown */}
          {dropdownVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subText}>Manage menu, orders & restaurant profile.</Text>

        <View style={styles.cardContainer}>
          {/* Add Menu Item */}
          <TouchableOpacity 
  style={[styles.card, { backgroundColor: "#FF7043" }]} 
  onPress={() => navigation.navigate("AddMenuItem")}
>
  <Text style={styles.cardEmoji}>🍔</Text>
  <Text style={styles.cardTitle}>Add Menu Item</Text>
  <Text style={styles.cardDesc}>Add new dishes to your menu</Text>
</TouchableOpacity>

          {/* View Orders */}
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: "#42A5F5" }]} 
            onPress={() => navigation.navigate("ResOwnerOrder")}
          >
            <Text style={styles.cardEmoji}>🛒</Text>
            <Text style={styles.cardTitle}>View Orders</Text>
            <Text style={styles.cardDesc}>Check and update order status</Text>
          </TouchableOpacity>

          {/* Manage Menu */}
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: "#66BB6A" }]} 
            onPress={() => navigation.navigate("ManageMenu")}
          >
            <Text style={styles.cardEmoji}>📋</Text>
            <Text style={styles.cardTitle}>Manage Menu</Text>
            <Text style={styles.cardDesc}>Edit or remove existing items</Text>
          </TouchableOpacity>

          {/* Restaurant Profile */}
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: "#AB47BC" }]} 
            onPress={() => navigation.navigate("RestaurantProfile")}
          >
            <Text style={styles.cardEmoji}>🏪</Text>
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardDesc}>Update restaurant details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    backgroundColor: "#388E3C",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
  },
  backBtn: {
    marginRight: 10,
    padding: 5,
  },
  backArrow: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1 },
  profileBtn: { flexDirection: "row", alignItems: "center" },
  profileImage: { width: 32, height: 32, borderRadius: 16, marginRight: 6 },
  profileText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  dropdown: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: 120,
    zIndex: 100,
  },
  dropdownItem: { padding: 12 },
  dropdownText: { fontSize: 15, color: "#333", fontWeight: "500" },
  container: { flexGrow: 1, padding: 20 },
  subText: { fontSize: 15, color: "#555", marginBottom: 20 },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardEmoji: { fontSize: 30 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 13,
    color: "#f0f0f0",
    textAlign: "center",
    marginTop: 4,
  },
});

export default RestaurantDashboard;
