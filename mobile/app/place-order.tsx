import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Card,
  HelperText,
} from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

export default function PlaceOrderScreen() {
  const { items, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();

  const handlePlaceOrder = async () => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        items: items.map((item) => ({
          food: item._id,
          quantity: item.quantity,
        })),
        customerName,
        phone,
        address,
        totalAmount: getTotalAmount(),
      };

      const response = await axios.post(`${API_URL}/order/place`, orderData);
      console.log(response.data);
      clearCart();
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Place Order</Title>

      {items.map((item) => (
        <Card key={item._id} style={styles.itemCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>{item.name}</Title>
            <Paragraph style={styles.description}>
              Quantity: {item.quantity}
            </Paragraph>
            <Paragraph style={styles.price}>
              ${(item.price * item.quantity).toFixed(2)}
            </Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Card style={styles.totalCard}>
        <Card.Content>
          <Title style={styles.totalAmount}>
            Total: ${getTotalAmount().toFixed(2)}
          </Title>
        </Card.Content>
      </Card>

      <View style={styles.form}>
        <TextInput
          label="Customer Name"
          value={customerName}
          onChangeText={setCustomerName}
          mode="outlined"
          style={styles.input}
          theme={{
            colors: { primary: Colors[colorScheme ?? "light"].primary },
          }}
          textColor="#FFFFFF"
          outlineColor="#333333"
        />

        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          theme={{
            colors: { primary: Colors[colorScheme ?? "light"].primary },
          }}
          textColor="#FFFFFF"
          outlineColor="#333333"
        />

        <TextInput
          label="Delivery Address"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          theme={{
            colors: { primary: Colors[colorScheme ?? "light"].primary },
          }}
          textColor="#FFFFFF"
          outlineColor="#333333"
        />

        {error ? (
          <HelperText type="error" style={styles.error}>
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading || items.length === 0}
          style={styles.button}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Place Order
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    margin: 16,
    color: "#FFFFFF",
  },
  itemCard: {
    margin: 8,
    marginHorizontal: 16,
    backgroundColor: "#1A1A1A",
  },
  cardTitle: {
    color: "#FFFFFF",
  },
  description: {
    color: "#CCCCCC",
  },
  price: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  totalCard: {
    margin: 16,
    backgroundColor: "#1A1A1A",
  },
  totalAmount: {
    color: "#FFFFFF",
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: "#FF6B6B",
  },
});
