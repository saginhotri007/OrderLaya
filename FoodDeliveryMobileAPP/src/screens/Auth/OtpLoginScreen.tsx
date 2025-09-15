import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from "react-native";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleGenerateOtp = async () => {
    try {
      const response = await axios.post('https://your-api-url.com/api/otp/generate-otp', { phoneNumber });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('https://your-api-url.com/api/otp/verify-otp', otp);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <Button title="Generate OTP" onPress={handleGenerateOtp} />

      <TextInput
        placeholder="OTP"
        value={otp}
        onChangeText={(text) => setOtp(text)}
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
};