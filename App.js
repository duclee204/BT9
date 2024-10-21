import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar as RNStatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Tạo Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInScreen">
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Màn hình đăng nhập
function SignInScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const validatePhoneNumber = (number) => {
    const regex = /^[0-9]{10}$/; // Kiểm tra định dạng số điện thoại 10 chữ số
    return regex.test(number);
  };

  const handleChangeText = (text) => {
    const formattedText = text.replace(/[^0-9]/g, "");
    setPhoneNumber(formattedText);

    if (!validatePhoneNumber(formattedText)) {
      setError("Số điện thoại không đúng định dạng. Vui lòng nhập lại.");
    } else {
      setError("");
    }
  };

  const handleContinue = async () => {
    if (validatePhoneNumber(phoneNumber)) {
      // Lưu số điện thoại vào AsyncStorage
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      navigation.navigate('HomeScreen'); // Điều hướng tới HomeScreen khi số hợp lệ
    } else {
      alert("Số điện thoại không đúng định dạng. Vui lòng nhập lại.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.shadowBox}>
          <Text style={styles.title}>Đăng nhập</Text>
        </View>
        <Text style={styles.subtitle}>Nhập số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại của bạn"
          keyboardType="numeric"
          maxLength={10}
          value={phoneNumber}
          onChangeText={handleChangeText}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.buttonEnabled}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

// Màn hình Home
function HomeScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Lấy số điện thoại từ AsyncStorage khi màn hình được tải
    const fetchPhoneNumber = async () => {
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (savedPhoneNumber) {
        setPhoneNumber(savedPhoneNumber);
      }
    };

    fetchPhoneNumber();
  }, []);

  return (
    <View style={styles.containerHome}>
      <Text style={styles.title}>Chào mừng đến HomeScreen!</Text>
      {/* Kiểm tra và hiển thị số điện thoại */}
      <Text style={styles.subtitle}>
        Số điện thoại đăng nhập: {phoneNumber ? phoneNumber : "Không có số điện thoại"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 40,
  },
  containerHome: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    justifyContent: "center",
  },
  shadowBox: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: "center", 
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 5,
  },
  buttonEnabled: {
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: "blue",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    fontSize: 14,
    color: "red", 
    marginBottom: 20,
  },
});
