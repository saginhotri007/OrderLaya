import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { CartContext, CartItem } from "../../../components/CartContext";
import { placeOrder, CreateOrderRequest, AddressDTO } from "../../../services/orderService"; 
import pizzaImg from "../../assets/pizzanew.jpg";
import burgerImg from "../../assets/burgernew.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const banks = [
  { name: "HDFC", logo: require("../../assets/hdfc.png") },
  { name: "ICICI", logo: require("../../assets/icici.png") },
  { name: "PNB", logo: require("../../assets/pnb.png") },
  { name: "SBI", logo: require("../../assets/sbi.png") },
  { name: "AXIS", logo: require("../../assets/axis.png") },
];

export default function CheckoutScreen({ route, navigation }: any) {
  const cartContext = useContext(CartContext);
  const { cartItems, subtotal, shipping, tax, total, address, RestaurantID,id } =
    route.params;

  const [userID, setUserID] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("COD");
  const [loading, setLoading] = useState(false);

  // ✅ Load userID from AsyncStorage once
  useEffect(() => {
    const loadUserID = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserID(user.userID); // assuming your stored object has userID
        }
      } catch (error) {
        console.log("Failed to load user from storage", error);
      }
    };
    loadUserID();
  }, []);

  if (!cartContext) return null;

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      <Image
        source={
          item.name.toLowerCase().includes("burger")
            ? burgerImg
            : item.name.toLowerCase().includes("pizza")
            ? pizzaImg
            : { uri: item.imagePath }
        }
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );

  const handlePlaceOrder = async () => {
    if (!userID) {
      Alert.alert("Error", "User not logged in");
      return;
    }
    if (!address) {
      Alert.alert("Error", "Please add an address before placing the order.");
      return;
    }

    const orderPayload: CreateOrderRequest = {
      userID,
      address: address as AddressDTO,
      items: cartItems.map((item: CartItem) => ({
        itemID: item.itemID,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
      })),
      subtotal,
      shipping,
      tax,
      total,
      RestaurantID:id,
    };

    try {
      setLoading(true);
      const response = await placeOrder(orderPayload);

      if (response.success) {
        Alert.alert("Success", response.message || "Order placed successfully!");
       // cartContext.clearCart?.(); // ✅ clear cart
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Place Order Error:", error);
      Alert.alert("Error", "Something went wrong while placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay with</Text>
      </View>

      {/* Amount to pay */}
      <View style={styles.toPayRow}>
        <Text style={styles.toPayLabel}>To Pay (Incl. Taxes)</Text>
        <Text style={styles.toPayAmount}>₹{total}</Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.itemID.toString()}
        renderItem={renderItem}
        style={{ maxHeight: 250 }}
      />

      {/* NetBanking (dummy UI only) */}
      <Text style={styles.sectionTitle}>NetBanking</Text>
      <View style={styles.bankGrid}>
        {banks.map((bank) => (
          <TouchableOpacity key={bank.name} style={styles.bankBtn}>
            <Image source={bank.logo} style={styles.bankLogo} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Pay on Delivery */}
      <Text style={styles.sectionTitle}>Other Payment Options</Text>
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setSelectedPayment("COD")}
      >
        <View style={styles.radioCircle}>
          {selectedPayment === "COD" && <View style={styles.selectedDot} />}
        </View>
        <Text style={styles.radioLabel}>Pay on Delivery</Text>
      </TouchableOpacity>

      {/* Place Order Button */}
      <TouchableOpacity
        style={styles.placeOrderBtn}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        <Text style={styles.placeOrderText}>
          {loading ? "Placing Order..." : "Place Order"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backArrow: { fontSize: 24 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginLeft: 16 },
  toPayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  toPayLabel: { fontSize: 16, color: "#333" },
  toPayAmount: { fontSize: 18, fontWeight: "bold", color: "#000" },
  itemCard: {
    flexDirection: "row",
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1 },
  itemName: { fontWeight: "bold", fontSize: 16 },
  itemQty: { color: "#555" },
  itemPrice: { color: "#FF6347", fontWeight: "bold" },
  sectionTitle: { fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  bankGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bankBtn: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  bankLogo: { width: 40, height: 24, resizeMode: "contain" },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  radioLabel: { fontSize: 16, color: "#333" },
  placeOrderBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  placeOrderText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
