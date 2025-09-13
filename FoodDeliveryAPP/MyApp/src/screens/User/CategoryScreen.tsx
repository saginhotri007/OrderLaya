// src/screens/User/CategoryScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import api from "../../../services/api";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function CategoryScreen({ route }: any) {
  const { categoryID, categoryName } = route.params;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/MenuItems/category/${categoryID}`);
        if (res.data.success) {
          setItems(res.data.data);
        } else {
          Alert.alert("Error", "Failed to fetch items");
        }
      } catch (error: any) {
        console.log(error.message);
        Alert.alert("Error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [categoryID]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : items.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No items found.</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image
              source={{ uri: "https://source.unsplash.com/400x300/?food" }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>₹ {item.price}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FF6347", marginBottom: 15 },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  itemImage: { width: "100%", height: 180 },
  itemInfo: { padding: 10 },
  itemName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  itemDescription: { fontSize: 14, color: "#666", marginTop: 4 },
  itemPrice: { fontSize: 16, color: "#FF6347", marginTop: 6, fontWeight: "bold" },
});
