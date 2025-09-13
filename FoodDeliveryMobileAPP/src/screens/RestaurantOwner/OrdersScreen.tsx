// screens/Admin/OrderScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import {
  fetchOrders,
  updateOrderStatus,
  Order,
} from "../../../services/ResOwnerService"; // ✅ Import service

const OrderScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      // ✅ Replace with your restaurantID (maybe from logged-in user context)
      const restaurantID = 8;
      const data = await fetchOrders(restaurantID);
      
      setOrders(data);
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Accept order
  const handleAccept = async (orderID: number) => {
    try {
      await updateOrderStatus(orderID, "Confirmed");
      Alert.alert("✅ Order Accepted");
      loadOrders();
    } catch (error) {
      Alert.alert("Error", "Failed to accept order");
    }
  };

  // Reject order
  const handleReject = async (orderID: number) => {
    try {
      await updateOrderStatus(orderID, "Rejected");
      Alert.alert("❌ Order Rejected");
      loadOrders();
    } catch (error) {
      Alert.alert("Error", "Failed to reject order");
    }
  };

  // Render each order card
  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      {/* Items */}
      <ScrollView style={{ maxHeight: 120 }}>
        {item.items.map((orderItem) => (
          <Text key={orderItem.itemID} style={styles.itemText}>
            • {orderItem.name} × {orderItem.quantity} — ₹
            {orderItem.price * orderItem.quantity}
          </Text>
        ))}
      </ScrollView>

      {/* Address */}
      <Text style={styles.address}>📍 {item.address}</Text>

      {/* Total */}
      <Text style={styles.total}>Total: ₹{item.total}</Text>

      {/* Action Buttons */}
      {item.status === "Pending" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => handleAccept(item.orderID)}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            onPress={() => handleReject(item.orderID)}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Incoming Orders</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>🍽️ No orders right now</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderID.toString()}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
  card: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  customerName: { fontWeight: "bold", fontSize: 16 },
  status: { fontSize: 14, color: "#FF6347", fontWeight: "600" },
  itemText: { fontSize: 14, color: "#444" },
  address: { marginTop: 6, fontSize: 13, color: "#555" },
  total: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 8,
    color: "#000",
  },
  actionRow: { flexDirection: "row", marginTop: 12 },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  acceptBtn: { backgroundColor: "#4CAF50" },
  rejectBtn: { backgroundColor: "#F44336" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});

export default OrderScreen;
