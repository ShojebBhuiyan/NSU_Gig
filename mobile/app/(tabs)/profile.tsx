import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  List,
} from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import { Order, User } from "../../types";
import { useAuth } from "../../context/AuthContext";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card style={styles.orderCard}>
      <Card.Content>
        <Title style={styles.title}>Order #{item._id.slice(-6)}</Title>
        <Paragraph style={styles.description}>
          Date: {new Date(item.createdAt).toLocaleDateString()}
        </Paragraph>
        <Paragraph style={styles.description}>Status: {item.status}</Paragraph>
        <Paragraph style={styles.total}>
          Total: ${item.totalAmount.toFixed(2)}
        </Paragraph>
        <List.Section>
          <List.Subheader style={styles.subheader}>Items</List.Subheader>
          {item.items.map((orderItem) => (
            <List.Item
              key={orderItem._id}
              title={orderItem.name}
              titleStyle={styles.itemTitle}
              description={`Quantity: ${orderItem.quantity}`}
              descriptionStyle={styles.description}
              right={() => (
                <Paragraph style={styles.itemPrice}>
                  ${(orderItem.price * orderItem.quantity).toFixed(2)}
                </Paragraph>
              )}
            />
          ))}
        </List.Section>
      </Card.Content>
    </Card>
  );

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Title style={styles.title}>Please Login</Title>
        <Button
          mode="contained"
          onPress={() => router.push("/(auth)/login")}
          style={styles.button}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Login
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={80}
          label={user.name.charAt(0)}
          color="#FFFFFF"
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        <Title style={styles.userName}>{user.name}</Title>
        <Paragraph style={styles.description}>{user.email}</Paragraph>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={Colors[colorScheme ?? "light"].primary}
        >
          Logout
        </Button>
      </View>

      <Title style={styles.ordersTitle}>Order History</Title>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.ordersList}
        refreshing={loading}
        onRefresh={fetchOrders}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    marginBottom: 16,
    color: "#FFFFFF",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A1A",
  },
  avatar: {
    backgroundColor: "#FF8C00",
  },
  avatarLabel: {
    fontSize: 36,
  },
  userName: {
    marginTop: 10,
    color: "#FFFFFF",
  },
  description: {
    color: "#CCCCCC",
  },
  logoutButton: {
    marginTop: 16,
    borderColor: "#FF8C00",
  },
  button: {
    width: "100%",
  },
  ordersTitle: {
    padding: 16,
    color: "#FFFFFF",
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  subheader: {
    color: "#FF8C00",
  },
  itemTitle: {
    color: "#FFFFFF",
  },
  itemPrice: {
    color: "#FF8C00",
  },
  total: {
    fontWeight: "bold",
    color: "#FF8C00",
  },
});
