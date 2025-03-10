import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Chip,
  Searchbar,
} from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Order } from "../../types";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

export default function OrdersScreen() {
  const { admin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (admin) {
      fetchOrders();
    } else {
      router.replace("/(auth)/login");
    }
  }, [admin]);

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

  const updateOrderStatus = async (
    orderId: string,
    status: "pending" | "confirmed" | "delivered"
  ) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, { status });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Error", "Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return Colors[colorScheme ?? "light"].warning;
      case "confirmed":
        return Colors[colorScheme ?? "light"].info;
      case "delivered":
        return Colors[colorScheme ?? "light"].success;
      default:
        return Colors[colorScheme ?? "light"].primary;
    }
  };

  const filteredOrders = orders
    .filter((order) => (statusFilter ? order.status === statusFilter : true))
    .filter((order) =>
      searchQuery
        ? order._id.includes(searchQuery) ||
          order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card style={styles.card} onPress={() => router.push(`/order/${item._id}`)}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <Title style={styles.orderId}>Order #{item._id.slice(-6)}</Title>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(item.status) },
            ]}
            textStyle={styles.statusText}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>

        <Paragraph style={styles.date}>
          Date: {new Date(item.createdAt).toLocaleString()}
        </Paragraph>

        <Paragraph style={styles.customer}>
          Customer: {item.user.name}
        </Paragraph>

        <Paragraph style={styles.items}>Items: {item.items.length}</Paragraph>

        <Paragraph style={styles.total}>
          Total: ${item.totalAmount.toFixed(2)}
        </Paragraph>
      </Card.Content>

      <Card.Actions>
        {item.status === "pending" && (
          <Button
            mode="contained"
            onPress={() => updateOrderStatus(item._id, "confirmed")}
            style={styles.actionButton}
            buttonColor={Colors[colorScheme ?? "light"].info}
          >
            Confirm
          </Button>
        )}

        {item.status === "confirmed" && (
          <Button
            mode="contained"
            onPress={() => updateOrderStatus(item._id, "delivered")}
            style={styles.actionButton}
            buttonColor={Colors[colorScheme ?? "light"].success}
          >
            Mark Delivered
          </Button>
        )}

        <Button
          mode="outlined"
          onPress={() => router.push(`/order/${item._id}`)}
          style={styles.viewButton}
          textColor={Colors[colorScheme ?? "light"].primary}
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search orders..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor={Colors[colorScheme ?? "light"].primary}
        theme={{ colors: { primary: Colors[colorScheme ?? "light"].primary } }}
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={statusFilter === null}
          onPress={() => setStatusFilter(null)}
          style={styles.filterChip}
          selectedColor={Colors[colorScheme ?? "light"].primary}
        >
          All
        </Chip>
        <Chip
          selected={statusFilter === "pending"}
          onPress={() => setStatusFilter("pending")}
          style={styles.filterChip}
          selectedColor={Colors[colorScheme ?? "light"].warning}
        >
          Pending
        </Chip>
        <Chip
          selected={statusFilter === "confirmed"}
          onPress={() => setStatusFilter("confirmed")}
          style={styles.filterChip}
          selectedColor={Colors[colorScheme ?? "light"].info}
        >
          Confirmed
        </Chip>
        <Chip
          selected={statusFilter === "delivered"}
          onPress={() => setStatusFilter("delivered")}
          style={styles.filterChip}
          selectedColor={Colors[colorScheme ?? "light"].success}
        >
          Delivered
        </Chip>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  searchInput: {
    color: "#FFFFFF",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: "#1A1A1A",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  date: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 4,
  },
  customer: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 4,
  },
  items: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 4,
  },
  total: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionButton: {
    marginRight: 8,
  },
  viewButton: {
    borderColor: "#333333",
  },
});
