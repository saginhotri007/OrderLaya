// src/screens/User/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../../../services/api";

interface Category {
  categoryID: number;
  name: string;
  description: string;
  variants: number;
}

interface Restaurant {
  restaurantID: number;
  userID: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  status: string;
  createdAt: string;
}

export default function HomeScreen({ navigation }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const categoryImages: { [key: string]: string } = {
    Pizza: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png",
    Burgers: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    Drinks: "https://cdn-icons-png.flaticon.com/512/2910/2910763.png",
    Desserts: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  };

  const restaurantImages: { [key: string]: string } = {
    "Amezing Pizza":
      "https://images.unsplash.com/photo-1601924582975-2e0ee24c1d14?w=400",
    "Burger House":
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    "Sweet Desserts":
      "https://images.unsplash.com/photo-1601972837481-f517ad8d42f7?w=400",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesRes = await api.get("/MenuItems/categories");
        if (categoriesRes.data.success) setCategories(categoriesRes.data.data);

        const restaurantsRes = await api.get("/Restaurants/restaurants");
        if (restaurantsRes.data.success)
          setRestaurants(restaurantsRes.data.data);
      } catch (error: any) {
        console.log("Fetch error:", error.message);
        Alert.alert("Error", "Failed to fetch data from server");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔝 Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.locationText}>📍 Deliver to: Current Location</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Icon name="person-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 🔍 Search bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          placeholder="Search for restaurants, dishes, or cuisines"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🎉 Promo Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>50% OFF on first order</Text>
          <Image
            source={{
              uri: "https://i.ibb.co/HTFh9X0/burger.png",
            }}
            style={styles.bannerImage}
          />
        </View>

        {/* 🍕 Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FF6347" />
          ) : (
            categories.map((cat) => (
              <TouchableOpacity
                key={cat.categoryID}
                style={styles.categoryItem}
                onPress={() =>
                  navigation.navigate("Category", {
                    categoryID: cat.categoryID,
                    categoryName: cat.name,
                  })
                }
              >
                <Image
                  source={{
                    uri:
                      categoryImages[cat.name] || categoryImages["Pizza"],
                  }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* 🍔 Popular Restaurants */}
        <Text style={styles.sectionTitle}>Popular Restaurants</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF6347" />
          ) : filteredRestaurants.length === 0 ? (
            <Text style={{ marginLeft: 16 }}>No restaurants found.</Text>
          ) : (
            filteredRestaurants.map((rest) => (
              <TouchableOpacity
                key={rest.restaurantID}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("Restaurant", {
                    id: rest.restaurantID,
                    name: rest.name,
                  })
                }
              >
                <Image
                  source={{
                    uri:
                      restaurantImages[rest.name] ||
                      "https://source.unsplash.com/600x400/?restaurant",
                  }}
                  style={styles.cardImage}
                />
                <Text style={styles.cardTitle}>{rest.name}</Text>
                <Text style={styles.cardSub}>⭐ {rest.rating} ⏱ 30 mins</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* 🍲 Recommended */}
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        <View style={styles.recommended}>
          <Image
            source={{ uri: "https://i.ibb.co/3pY2KqM/biryani.png" }}
            style={styles.recImage}
          />
          <Text style={styles.recText}>Chicken Biryani</Text>
        </View>
        <View style={styles.recommended}>
          <Image
            source={{ uri: "https://i.ibb.co/sym3txV/pizza.png" }}
            style={styles.recImage}
          />
          <Text style={styles.recText}>Margherita Pizza</Text>
        </View>
      </ScrollView>

      {/* 📱 Bottom Navigation */}
      <View style={styles.bottomNav}>
  <Icon name="home-outline" size={24} color="#e53935" />
  <Icon name="search-outline" size={24} color="#555" />
  <Icon name="cart-outline" size={24} color="#555" />
  <Icon name="heart-outline" size={24} color="#555" />
  <Icon name="person-outline" size={24} color="#555" />
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  locationText: { fontSize: 14, color: "#333", fontWeight: "600" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  searchInput: { marginLeft: 8, flex: 1 },
  banner: {
    margin: 16,
    backgroundColor: "#43a047",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerText: { color: "#fff", fontSize: 18, fontWeight: "700", width: "60%" },
  bannerImage: { width: 70, height: 70, borderRadius: 10 },
  categories: { marginVertical: 10, paddingHorizontal: 10 },
  categoryItem: { alignItems: "center", marginHorizontal: 12 },
  categoryText: { fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", margin: 16 },
  card: {
    width: 140,
    marginLeft: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  cardImage: { width: "100%", height: 100 },
  cardTitle: { fontSize: 16, fontWeight: "600", margin: 8 },
  cardSub: { fontSize: 12, color: "#666", marginLeft: 8, marginBottom: 8 },
  recommended: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  recImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  recText: { fontSize: 16, fontWeight: "500" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
});
