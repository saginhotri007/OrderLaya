import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image 
} from "react-native";
import profileImg from "../../assets/profile.jpg";

const AdminDashboard = ({ navigation }:any) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const userName = "Admin"; // later fetch dynamically from auth

  const handleLogout = () => {
    setDropdownVisible(false);
    // 🔑 Clear login session here if using AsyncStorage/Context
    // AsyncStorage.removeItem("userToken"); 
    navigation.replace("LoginScreen"); // redirect to login
  };

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Dashboard</Text>

        {/* Profile Button */}
        <View>
          <TouchableOpacity 
            style={styles.profileBtn} 
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Image 
              source={profileImg} // replace with your image
              style={styles.profileImage}
            />
            <Text style={styles.profileText}>{userName}</Text>
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
        <Text style={styles.subText}>Manage restaurants, orders & performance.</Text>

        {/* Options Grid */}
        <View style={styles.cardContainer}>
          {/* Create Restaurant */}
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: "#FF7043" }]} 
            onPress={() => navigation.navigate("ManageRest")}
          >
            <Text style={styles.cardEmoji}>🏬</Text>
            <Text style={styles.cardTitle}>Create Restaurant</Text>
            <Text style={styles.cardDesc}>Add and onboard new partners</Text>
          </TouchableOpacity>

          {/* Manage Orders */}
          <TouchableOpacity style={[styles.card, { backgroundColor: "#42A5F5" }]}>
            <Text style={styles.cardEmoji}>📦</Text>
            <Text style={styles.cardTitle}>Manage Orderss</Text>
            <Text style={styles.cardDesc}>Track & update delivery status</Text>
          </TouchableOpacity>

          {/* Analytics */}
          <TouchableOpacity style={[styles.card, { backgroundColor: "#66BB6A" }]}>
            <Text style={styles.cardEmoji}>📊</Text>
            <Text style={styles.cardTitle}>Analytics</Text>
            <Text style={styles.cardDesc}>View sales & insights</Text>
          </TouchableOpacity>

          {/* Customers */}
          <TouchableOpacity style={[styles.card, { backgroundColor: "#AB47BC" }]}>
            <Text style={styles.cardEmoji}>👥</Text>
            <Text style={styles.cardTitle}>Customers</Text>
            <Text style={styles.cardDesc}>Manage customer data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#D32F2F", // Red header
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },
  profileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
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
  dropdownItem: {
    padding: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  subText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },
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
  cardEmoji: {
    fontSize: 30,
  },
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

export default AdminDashboard;
