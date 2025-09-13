import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import api from "../../../services/api";
import { CartContext, CartItem } from "../../../components/CartContext";

// ✅ Local images
import pizzaImg from "../../assets/pizzanew.jpg";
import burgerImg from "../../assets/burgernew.jpg";
import searchImg from "../../assets/search.jpg"; 

interface MenuItem {
  itemID: number;
  name: string;
  description: string;
  price: number;
  variant?: string;
  imagePath?: string | null;
  availability: boolean;
}

export default function RestaurantScreen({ route, navigation }: any) {
  const { id, name } = route.params;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const cartContext = useContext(CartContext);
  if (!cartContext) return null;
  const { addToCart, removeFromCart, cartItems } = cartContext;

  const getQuantity = (itemID: number) => {
    const found: CartItem | undefined = cartItems.find(
      (c: CartItem) => c.itemID === itemID
    );
    return found ? found.quantity : 0;
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/MenuItems/menuitems?restaurantId=${id}`);
        if (res.data.success) {
          setItems(res.data.data);
        } else {
          Alert.alert("Error", "Failed to fetch menu items");
        }
      } catch (error: any) {
        console.log(error.message);
        Alert.alert("Error", "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [id]);

  return (
    <View style={{ flex: 1 }}>
      {/* Scrollable Menu */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: cartItems.length > 0 ? 120 : 20 }} // space for cart bar
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{name}</Text>

          <TouchableOpacity onPress={() => Alert.alert("Search Clicked")}>
            <Image source={searchImg} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF6347" style={{ marginTop: 20 }} />
        ) : items.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No menu items found.
          </Text>
        ) : (
          items.map((item) => {
            const quantity = getQuantity(item.itemID);
            return (
              <View key={item.itemID} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Popular</Text>
                    </View>
                  </View>

                  <Text style={styles.itemDescription}>{item.description}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹ {item.price}</Text>

                    {quantity > 0 ? (
                      <View style={styles.qtyContainer}>
                        <TouchableOpacity
                          style={styles.qtyButton}
                          onPress={() => removeFromCart(item)}
                        >
                          <Text style={styles.qtyButtonText}>−</Text>
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyButton}
                          onPress={() => addToCart(item)}
                        >
                          <Text style={styles.qtyButtonText}>＋</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(item)}
                      >
                        <Text style={styles.addButtonText}>＋ Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {!item.availability && (
                    <Text style={styles.unavailable}>Currently unavailable</Text>
                  )}
                </View>

                <Image
                  source={
                    item.name.toLowerCase().includes("burger")
                      ? burgerImg
                      : item.name.toLowerCase().includes("pizza")
                      ? pizzaImg
                      : item.imagePath
                      ? { uri: item.imagePath }
                      : { uri: "https://source.unsplash.com/400x300/?food" }
                  }
                  style={styles.itemImage}
                />
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Fixed Cart Bar */}
      {cartItems.length > 0 && (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartText}>
              {cartItems.length} items • ₹
              {cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )}
            </Text>
            <Text style={styles.subText}>Extra charges may apply</Text>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate("Cart",{ id: id})}
          >
            <Text style={styles.cartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E23744",
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 4,
    borderRadius: 8,
  },
  backArrow: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  searchIcon: { width: 22, height: 22, tintColor: "#fff" },
  restaurantName: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 15 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  itemLeft: { flex: 1, paddingRight: 12 },
  itemImage: { width: 90, height: 90, borderRadius: 10, resizeMode: "cover" },
  itemName: { fontSize: 16, fontWeight: "bold", color: "#333", marginRight: 8 },
  badge: { backgroundColor: "#FFEDD5", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 12, color: "#FF6347", fontWeight: "600" },
  itemDescription: { fontSize: 14, color: "#666", marginVertical: 6 },
  itemPrice: { fontSize: 16, color: "#FF6347", fontWeight: "bold" },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  addButton: { backgroundColor: "#FF6347", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  qtyContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF6347", borderRadius: 8, paddingHorizontal: 6 },
  qtyButton: { padding: 6 },
  qtyButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  qtyText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginHorizontal: 6 },
  unavailable: { color: "red", fontSize: 13, marginTop: 4 },
  cartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 10,
  },
  cartText: { fontSize: 16, fontWeight: "600", color: "#333" },
  subText: { fontSize: 12, color: "#666" },
  cartButton: { backgroundColor: "#5D3FD3", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  cartButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
