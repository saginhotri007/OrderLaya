import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ScrollView,
  Image,
  Switch,
  Picker,
  StyleSheet,
} from "react-native";
import api from "../../api/apiClient";

const MenuItemsScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
const categoryVariants = {
  pizza: ["Regular", "Medium", "Large"],
  "main course": ["Full", "Half"]
};
const [variantOptions, setVariantOptions] = useState([]);
  const [form, setForm] = useState({
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

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
    fetchRestaurants(loggedInUser);
    fetchCategories();
  }, []);


useEffect(() => {
  const selectedCategory = categories.find(
    (c) => c.categoryID === parseInt(form.categoryID, 10) || 0
  );
  if (selectedCategory) {
    const normalizedName = selectedCategory.name.toLowerCase();
    setVariantOptions(categoryVariants[normalizedName] || []);
  } else {
    setVariantOptions([]);
  }
  setForm((prev) => ({ ...prev, variant: "" })); // reset variant
}, [form.categoryID, categories]);

  const fetchRestaurants = async (user) => {
    let res;
     try {
    if (user.role === "Admin") {
      res = await api.get("/restaurants");
    } else {
      res = await api.get(`/restaurants/restaurant?userID=${user.userID}`);
    }
     const data = res.data.data || [];
    setRestaurants(data);

    if (data.length > 0) {
      const firstRestaurantId = data[0].restaurantID;
      setForm((prev) => ({
        ...prev,
        restaurantID: firstRestaurantId.toString(), // store as string for Picker
      }));
      fetchMenuItems(firstRestaurantId); // Load menu items for this restaurant
    }
     } catch (error) {
    console.error("Failed to fetch restaurants", error);
  }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/menuitems/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

const fetchMenuItems = async (restaurantId) => {
  debugger;
  try {
    let url = "/menuitems/menuitems";
    if (restaurantId) {
      url += `?restaurantID=${restaurantId}`;
    }
    const res = await api.get(url);
    debugger;
    
    setMenuItems(res.data.data || []);
  } catch (error) {
    console.error("Failed to fetch menu items", error);
  }
};
  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryID || !form.restaurantID) {
      window.alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("Name", form.name);
    formData.append("Price", form.price);
    formData.append("CategoryID", form.categoryID);
    formData.append("RestaurantID", form.restaurantID);
    formData.append("Variant", form.variant);
    formData.append("Availability", form.availability);
    formData.append("Description", form.description);

    if (form.imageFile) {
      formData.append("ImageFile", form.imageFile);
    }

    try {
      if (form.id === 0) {
        await api.post("/menuitems/menuitem", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu item created successfully");
      } else {
        await api.put(`/menuitems/menuitem/${form.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu item updated successfully");
      }

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

      fetchMenuItems(form.restaurantID);
    } catch (err) {
      console.error(err);
      window.alert("Failed to save menu item");
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.itemID,
      restaurantID: item.restaurantID,
      categoryID: item.categoryID,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      availability: item.availability,
      imagePath: "",
      variant: item.variant || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/menuitems/menuitem/${id}`);
      fetchMenuItems(form.restaurantID);
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const handleImageChange = (e) => {
   setForm({ ...form, imagePath: e.target.files[0] });
      setForm({ ...form, imageFile: e.target.files[0] });
  };

  // Get current category name

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
          <Picker.Item key={r.restaurantID} label={r.name} value={r.restaurantID} />
        ))}
      </Picker>

      {/* Category Picker */}
      <Picker
  selectedValue={form.categoryID}
  onValueChange={(val) => {
    setForm((prev) => ({ ...prev, categoryID: val }));
    const selectedCategory = categories.find((c) => c.categoryID === val);
    if (selectedCategory) {
      setVariantOptions(categoryVariants[selectedCategory.name] || []);
    }
  }}
  style={styles.picker}
>
  <Picker.Item label="Select Category" value="" />
  {categories.map((c) => (
    <Picker.Item key={c.categoryID} label={c.name} value={c.categoryID} />
  ))}
</Picker>

      {/* Variant Picker (Dynamic) */}
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
        value={form.price.toString()}
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

      <input type="file" accept="image/*" onChange={handleImageChange} />
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
  image: { width: 100, height: 100, marginVertical: 10 },
  itemRow: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemActions: { flexDirection: "row", gap: 10, marginTop: 5 },
  itemImage: { width: 50, height: 50, marginTop: 5 },
});

export default MenuItemsScreen;
