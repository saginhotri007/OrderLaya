// src/components/Header.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
  navigation: any;
}

export default function Header({ search, setSearch, navigation }: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {/* Top Greeting & Cart */}
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerGreeting}>Hello!</Text>
          <Text style={styles.headerLocation}>📍 New Delhi, India</Text>
        </View>

        {/* Cart Icon */}
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png" }}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>🍔 Foodie App</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search for restaurants"
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { marginBottom: 20 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerGreeting: { fontSize: 16, color: "#555" },
  headerLocation: { fontSize: 14, color: "#888" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF6347", marginBottom: 10 },
  searchBar: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
});
