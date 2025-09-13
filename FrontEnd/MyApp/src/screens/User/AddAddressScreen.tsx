// screens/User/AddAddressScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/api";
import {
  AddressDTO,
  saveUserAddress,
} from "../../../services/orderService";
import { RootStackParamList } from "../../navigation/types";

// Types
type AddAddressScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddAddress"
>;
type AddAddressScreenRouteProp = RouteProp<RootStackParamList, "AddAddress">;

interface Props {
  route: AddAddressScreenRouteProp;
  navigation: AddAddressScreenNavigationProp;
}

export default function AddAddressScreen({ route, navigation }: Props) {
  const { id, cartItems, subtotal, shipping, tax, total } = route.params;
  const [userID, setUserID] = useState<number | null>(null);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

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
    const fetchUserAddress = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserID(user.userID);

          setLoading(true);
          const res = await api.get(`/Orders/Address?userId=${user.userID}`);
          if (res.data.data && res.data.data.length > 0) {
            const data = res.data.data[0];
            setAddress1(data.addressLine1 || "");
            setAddress2(data.addressLine2 || "");
            setLandmark(data.landmark || "");
            setCity(data.city || "");
            setPincode(data.pincode?.toString() || "");
          }
        }
      } catch (error: any) {
        console.log(error.message);
        Alert.alert("Error", "Failed to fetch address");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAddress();
  }, [id]);

  const saveAddressAndProceed = async () => {
    if (!address1 || !address2 || !landmark || !city || !pincode) {
      Alert.alert("Incomplete Address", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const AddressModel: AddressDTO = {
        addressID: 0,
        userID: userID?.toString() || "",
        addressLine1: address1,
        addressLine2: address2,
        landmark,
        city,
        pincode: pincode,
      };

      await saveUserAddress(AddressModel);

      navigation.navigate("Order", {
        id,
        cartItems,
        subtotal,
        shipping,
        tax,
        total,
        address: AddressModel,
      });
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Scrollable Form */}
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.sectionTitle}>Add / Update Address</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Address Line 1 *</Text>
          <TextInput
            style={styles.input}
            placeholder="House number, Street"
            value={address1}
            onChangeText={setAddress1}
          />

          <Text style={styles.label}>Address Line 2 *</Text>
          <TextInput
            style={styles.input}
            placeholder="Apartment, Building"
            value={address2}
            onChangeText={setAddress2}
          />

          <Text style={styles.label}>Landmark *</Text>
          <TextInput
            style={styles.input}
            placeholder="Near Landmark"
            value={landmark}
            onChangeText={setLandmark}
          />

          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>Pincode *</Text>
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveAddressAndProceed}>
          <Text style={styles.saveText}>Save & Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#FF6347", // Tomato (Swiggy-like)
    elevation: 3,
  },
  backBtn: { width: 30 },
  backText: { fontSize: 24, color: "#fff" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  form: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: { fontSize: 14, marginTop: 12, marginBottom: 4, fontWeight: "600", color: "#444" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  saveBtn: {
    backgroundColor: "#FF6347",
    padding: 16,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
    elevation: 2,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
