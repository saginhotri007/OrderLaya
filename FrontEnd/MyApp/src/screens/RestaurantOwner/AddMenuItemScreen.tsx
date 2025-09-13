import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ScrollView,
  Image,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

import {
  fetchRestaurants,
  fetchCategories,
  fetchMenuItems,
  saveMenuItem,
  deleteMenuItem,
  MenuItem,
  Category,
  Restaurant,
  User,
} from "../../../services/menuItemsService";

interface FormState {
  id: number;
  restaurantID: string;
  categoryID: string;
  name: string;
  description: string;
  price: string;
  availability: boolean;
  imagePath: string;
  imageFile?: any; // RN Image picker returns Asset
  variant: string;
  imagePreview?: string;
}

const categoryVariants: Record<string, string[]> = {
  pizza: ["Regular", "Medium", "Large"],
  "main course": ["Full", "Half"],
};

const MenuItemsScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [variantOptions, setVariantOptions] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState<FormState>({
    id: 0,
    restaurantID: "",
    categoryID: "",
    name: "",
    description: "",
    price: "",
    availability: true,
    imagePath: "",
    variant: "",
  });

  // ✅ Load user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const loggedInUser: User = JSON.parse(userData);
          setUser(loggedInUser);
          loadData(loggedInUser);
        }
      } catch (err) {
        console.error("Failed to load user from AsyncStorage", err);
      }
    };
    loadUser();
  }, []);

  // ✅ Load restaurants & categories
  const loadData = async (loggedInUser: User) => {
    try {
      const resData = await fetchRestaurants(loggedInUser);
      setRestaurants(resData);

      if (resData.length > 0) {
        const firstRestaurantId = resData[0].restaurantID.toString();
        setForm((prev) => ({ ...prev, restaurantID: firstRestaurantId }));
        loadMenuItems(Number(firstRestaurantId));
      }

      const catData = await fetchCategories();
      setCategories(catData);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  // ✅ Load menu items for selected restaurant
  const loadMenuItems = async (restaurantID: number) => {
    try {
      const items = await fetchMenuItems(restaurantID);
      setMenuItems(items);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
    }
  };

  // ✅ Handle category → load variants
  useEffect(() => {
    const selectedCategory = categories.find(
      (c) => c.categoryID === Number(form.categoryID)
    );
    if (selectedCategory) {
      const normalizedName = selectedCategory.name.toLowerCase();
      setVariantOptions(categoryVariants[normalizedName] || []);
    } else {
      setVariantOptions([]);
    }
    setForm((prev) => ({ ...prev, variant: "" }));
  }, [form.categoryID, categories]);

  // ✅ Save or update menu item
  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryID || !form.restaurantID) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("Name", form.name);
    formData.append("Price", form.price);
    formData.append("CategoryID", form.categoryID);
    formData.append("RestaurantID", form.restaurantID);
    formData.append("Variant", form.variant);
    formData.append("Availability", form.availability.toString());
    formData.append("Description", form.description);

    if (form.imageFile) {
      formData.append("ImageFile", {
        uri: form.imageFile.uri,
        type: form.imageFile.type,
        name: form.imageFile.fileName || "upload.jpg",
      });
    }

    try {
      await saveMenuItem(formData, form.id);
      Alert.alert(
        "Success",
        form.id === 0 ? "Menu item created successfully" : "Menu item updated successfully"
      );

      setForm({
        id: 0,
        restaurantID: form.restaurantID,
        categoryID: "",
        name: "",
        description: "",
        price: "",
        availability: true,
        imagePath: "",
        variant: "",
      });

      loadMenuItems(Number(form.restaurantID));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save menu item");
    }
  };

  // ✅ Edit
  const handleEdit = (item: MenuItem) => {
    setForm({
      id: item.itemID,
      restaurantID: item.restaurantID.toString(),
      categoryID: item.categoryID.toString(),
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      availability: item.availability,
      imagePath: "",
      variant: item.variant || "",
    });
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMenuItem(id);
            loadMenuItems(Number(form.restaurantID));
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete");
          }
        },
      },
    ]);
  };

  // ✅ Image picker (RN)
  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: file.uri,
      }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Menu Items</Text>

      {/* Restaurant Picker */}
      <Picker
        selectedValue={form.restaurantID}
        onValueChange={(val) => setForm((prev) => ({ ...prev, restaurantID: val }))}
        style={styles.picker}
      >
        <Picker.Item label="Select Restaurant" value="" />
        {restaurants.map((r) => (
          <Picker.Item key={r.restaurantID} label={r.name} value={r.restaurantID.toString()} />
        ))}
      </Picker>

      {/* Category Picker */}
      <Picker
        selectedValue={form.categoryID}
        onValueChange={(val) => setForm((prev) => ({ ...prev, categoryID: val }))}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((c) => (
          <Picker.Item key={c.categoryID} label={c.name} value={c.categoryID.toString()} />
        ))}
      </Picker>

      {/* Variant Picker */}
      {variantOptions.length > 0 && (
        <Picker
          selectedValue={form.variant}
          onValueChange={(val) => setForm((prev) => ({ ...prev, variant: val }))}
          style={styles.picker}
        >
          <Picker.Item label="Select Variant" value="" />
          {variantOptions.map((v) => (
            <Picker.Item key={v} label={v} value={v} />
          ))}
        </Picker>
      )}

      <TextInput
        placeholder="Item Name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={form.price}
        keyboardType="numeric"
        onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
        style={styles.input}
      />

      {/* Image Picker */}
      <Button title="Pick Image" onPress={handleImagePick} />
      {form.imagePreview && (
        <Image source={{ uri: form.imagePreview }} style={styles.image} />
      )}

      <View style={styles.switchContainer}>
        <Text>Available</Text>
        <Switch
          value={form.availability}
          onValueChange={(val) => setForm((prev) => ({ ...prev, availability: val }))}
        />
      </View>

      <Button title={form.id === 0 ? "Add" : "Update"} onPress={handleSave} />

      <Text style={styles.subtitle}>Menu Items List</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.itemID.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>
              {item.name} ({item.variant}) - ₹{item.price}
            </Text>
            {item.imagePath && (
              <Image source={{ uri: item.imagePath }} style={styles.itemImage} />
            )}
            <View style={styles.itemActions}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" color="red" onPress={() => handleDelete(item.itemID)} />
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  subtitle: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10 },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  image: { width: 100, height: 100, marginVertical: 10, borderRadius: 5 },
  itemRow: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemActions: { flexDirection: "row", gap: 10, marginTop: 5 },
  itemImage: { width: 50, height: 50, marginTop: 5, borderRadius: 5 },
});

export default MenuItemsScreen;
