import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { CartContext, CartItem } from "../../../components/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pizzaImg from "../../assets/pizzanew.jpg";
import burgerImg from "../../assets/burgernew.jpg";

export default function CartScreen({ route, navigation }: any) {
  const cartContext = useContext(CartContext);
  const { id } = route.params; // restaurantsID

  if (!cartContext) return null;

  const { cartItems, addToCart, removeFromCart, removeItemCompletely } = cartContext;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 25;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
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
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => addToCart(item)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItemCompletely(item)}>
        <Text style={styles.trashIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Cart</Text>
      <View style={{ width: 30 }} />
    </View>
  );

  const ListFooter = () => (
    <View style={styles.summary}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Sub Total</Text>
        <Text style={styles.summaryText}>${subtotal}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Shipping</Text>
        <Text style={styles.summaryText}>${shipping}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Tax (10%)</Text>
        <Text style={styles.summaryText}>${tax.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryText, { fontWeight: "bold" }]}>Total</Text>
        <Text style={[styles.summaryText, { fontWeight: "bold" }]}>${total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={async () => {
          const token = await AsyncStorage.getItem("token");
          if (token) {
            navigation.navigate("AddAddress", {
              id: id,
              cartItems,
              subtotal,
              shipping,
              tax,
              total,
            });
          } else {
            Alert.alert("Login Required", "Please login to proceed", [
              { text: "Cancel", style: "cancel" },
              { text: "Login", onPress: () => navigation.navigate("Login") },
            ]);
          }
        }}
      >
        <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <ListHeader />
        <Text style={styles.emptyText}>Your cart is empty!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cartItems}
      keyExtractor={(item) => item.itemID.toString()}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#FF6347",
  },
  backBtn: { width: 30 },
  backText: { fontSize: 24, color: "#fff" },
  headerTitle: { flex: 1, textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  itemPrice: { fontSize: 14, color: "#FF6347", marginBottom: 8 },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#FF6347", borderRadius: 6 },
  qtyText: { color: "#333", fontWeight: "bold", fontSize: 16, marginHorizontal: 6 },
  trashIcon: { fontSize: 24, color: "#FF6347", marginLeft: 8 },
  summary: { marginTop: 20, borderTopWidth: 1, borderColor: "#eee", paddingTop: 16, paddingHorizontal: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryText: { fontSize: 16, color: "#333" },
  checkoutBtn: { backgroundColor: "#FF6347", padding: 16, borderRadius: 8, marginTop: 16 },
  checkoutText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#999" },
});
