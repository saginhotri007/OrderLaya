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
  Image,
} from "react-native";
import {
  getRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  RestaurantDTO,
  RestaurantPayload,
} from "../../../services/restaurantService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

const ManageRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
  const [form, setForm] = useState<RestaurantPayload>({
    RestaurantID: 0,
    UserID: 0,
    Name: "",
    Description: "",
    Address: "",
    Phone: "",
    Status: "Open",
    Image: "",
  });
  const [userID, setUserID] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadUserID = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserID(user.userID);
        }
      } catch (error) {
        console.log("Failed to load user from storage", error);
      }
    };
    loadUserID();
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [userID]);

  const fetchRestaurants = async () => {
    try {
      if (!userID) return;
      const data = await getRestaurants(userID);
      setRestaurants(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch restaurants");
    }
  };

  const handleChange = (key: keyof RestaurantPayload, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setImageUri(uri);
        }
      }
    });
  };

 const handleSubmit = async () => {
  if (
    !form.Name.trim() ||
    !form.Description.trim() ||
    !form.Address.trim() ||
    !form.Phone.trim()
  ) {
    Alert.alert("Validation Error", "Please fill all fields");
    return;
  }

  const userId = userID ?? 0;

  try {
    const payload: RestaurantPayload = {
      ...form,
      UserID: userId,
      Image: imageUri || form.Image, // 👈 send picked image OR existing one
    };

    if (form.RestaurantID === 0) {
      await addRestaurant(payload); // service builds FormData & uploads
    } else {
      await updateRestaurant(form.RestaurantID || 0, payload);
    }

    // Reset form
    setForm({
      RestaurantID: 0,
      UserID: 0,
      Name: "",
      Description: "",
      Address: "",
      Phone: "",
      Status: "Open",
      Image: "",
    });
    setImageUri(null);

    fetchRestaurants();
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Failed to save restaurant");
  }
};


  const handleEdit = (r: RestaurantDTO) => {
    setForm({
      RestaurantID: r.restaurantID,
      UserID: r.userID,
      Name: r.name,
      Description: r.description,
      Address: r.address,
      Phone: r.phone,
      Status: r.status,
      Image: r.image || "",
    });
    setImageUri(r.image || null);
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await deleteRestaurant(id);
          fetchRestaurants();
        },
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item }: { item: RestaurantDTO }) => (
    <View style={styles.itemContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text>📷</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>
          {item.name} ({item.status})
        </Text>
        <Text>{item.address}</Text>
        <Text>{item.phone}</Text>
      </View>
      <View style={styles.buttonRow}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <Button
          title="Delete"
          color="red"
          onPress={() => handleDelete(item.restaurantID)}
        />
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
        placeholder="Addresss"
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

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>

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

export default ManageRestaurants;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  statusSelected: { backgroundColor: "#ddd" },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  placeholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  buttonRow: { justifyContent: "space-between" },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
  },
  previewImage: { width: 100, height: 100, borderRadius: 8 },
});
