import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import api from "../../api/apiClient"; // same apiClient

const RestaurantScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    RestaurantID: 0,
    UserID: 0,
    Name: "",
    Description: "",
    Address: "",
    Phone: "",
    Status: "Open",
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")); // or AsyncStorage if mobile
      const userID = user?.userID ?? 0;

      const res = await api.get(`/restaurants/restaurant?userID=${userID}`);
      if (res.data.success) setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch restaurants");
    }
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

 const handleSubmit = async () => {
  try {
     if (
      !form.Name.trim() ||
      !form.Description.trim() ||
      !form.Address.trim() ||
      !form.Phone.trim() ||
      !form.Status.trim()
    ) {
      window.alert("Validation Error! Please fill all fields");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user?.userID ?? 0;

    const payload = { ...form, UserID: userID };

    let res;
    if (form.RestaurantID === 0) {
      res = await api.post("/restaurants/restaurant", payload);
    } else {
      res = await api.put(`/restaurants/restaurant/${form.RestaurantID}`, payload);
    }
    debugger;

    if (res.data.success) {
      window.alert( "Restaurant saved successfully");
    } else {
      window.alert("Failed to save");
    }

    setForm({
      RestaurantID: 0,
      UserID: 0,
      Name: "",
      Description: "",
      Address: "",
      Phone: "",
      Status: "Open",
    });

    fetchRestaurants();
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Something went wrong");
  }
};


  const handleEdit = (r) => {
    setForm({
      RestaurantID: r.restaurantID,
      UserID: r.userID,
      Name: r.name,
      Description: r.description,
      Address: r.address,
      Phone: r.phone,
      Status: r.status,
    });
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this restaurant?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const res = await api.delete(`/restaurants/restaurant/${id}`);
              if (res.data.success) fetchRestaurants();
            } catch (err) {
              console.error(err);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.name} ({item.status})
      </Text>
      <View style={styles.buttonRow}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <Button title="Delete" color="red" onPress={() => handleDelete(item.restaurantID)} />
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Restaurant Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={form.Name}
        onChangeText={(val) => handleChange("Name", val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={form.Description}
        onChangeText={(val) => handleChange("Description", val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.Address}
        onChangeText={(val) => handleChange("Address", val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.Phone}
        onChangeText={(val) => handleChange("Phone", val)}
        keyboardType="phone-pad"
      />
      <View style={styles.statusContainer}>
        <Text>Status:</Text>
        <TouchableOpacity
          style={[
            styles.statusButton,
            form.Status === "Open" && styles.statusSelected,
          ]}
          onPress={() => handleChange("Status", "Open")}
        >
          <Text>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            form.Status === "Closed" && styles.statusSelected,
          ]}
          onPress={() => handleChange("Status", "Closed")}
        >
          <Text>Inactive</Text>
        </TouchableOpacity>
      </View>

      <Button
        title={form.RestaurantID === 0 ? "Add Restaurant" : "Update Restaurant"}
        onPress={handleSubmit}
      />

      <Text style={styles.subtitle}>Restaurant List</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurantID.toString()}
        renderItem={renderItem}
      />
    </ScrollView>
  );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 30, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  statusContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  statusButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  statusSelected: { backgroundColor: "#ddd" },
  itemContainer: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  itemText: { fontSize: 16, marginBottom: 5 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
});
