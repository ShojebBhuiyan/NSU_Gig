import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert, ScrollView } from "react-native";
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
      const response = await axios.get(`${API_URL}/order/list`);
      if (response.data && response.data.success) {
        setOrders(response.data.data);
        console.log("Orders data:", response.data.data);
      } else {
        setOrders(response.data);
        console.log("Orders data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.post(`${API_URL}/order/status`, {
        data: { orderId, status },
      });
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
      case "Food Processing":
        return Colors[colorScheme ?? "light"].warning;
      case "Out for delivery":
        return Colors[colorScheme ?? "light"].info;
      case "Delivered":
        return Colors[colorScheme ?? "light"].success;
      default:
        return Colors[colorScheme ?? "light"].primary;
    }
  };

  const filteredOrders = orders
    .filter((order) => (statusFilter ? order.status === statusFilter : true))
    .filter((order) => (searchQuery ? order._id.includes(searchQuery) : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card
      style={[
        styles.card,
        { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
      ]}
      // onPress={() => router.push(`/order/${item._id}`)}
    >
      <Card.Content>
        <View style={styles.orderHeader}>
          <Title
            style={[
              styles.orderId,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Order #{item._id.slice(-6)}
          </Title>
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

        <Paragraph
          style={[styles.date, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Date: {new Date(item.date).toLocaleString()}
        </Paragraph>

        <Paragraph
          style={[
            styles.customer,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Customer: {item.address.firstName} {item.address.lastName}
        </Paragraph>

        <Paragraph
          style={[styles.items, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Items: {item.items.map((i) => i.name).join(", ")}
        </Paragraph>

        <Paragraph
          style={[
            styles.address,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Address: {item.address.street}, {item.address.city},{" "}
          {item.address.state}, {item.address.zipcode}, {item.address.country}
        </Paragraph>

        <Paragraph
          style={[styles.phone, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Phone: {item.address.phone}
        </Paragraph>

        <Paragraph style={styles.total}>
          Total: ${item.amount.toFixed(2)}
        </Paragraph>
      </Card.Content>

      <Card.Actions>
        {item.status === "Food Processing" && (
          <Button
            mode="contained"
            onPress={() => updateOrderStatus(item._id, "Out for delivery")}
            style={styles.actionButton}
            buttonColor={Colors[colorScheme ?? "light"].info}
          >
            Mark Out for Delivery
          </Button>
        )}

        {item.status === "Out for delivery" && (
          <Button
            mode="contained"
            onPress={() => updateOrderStatus(item._id, "Delivered")}
            style={styles.actionButton}
            buttonColor={Colors[colorScheme ?? "light"].success}
          >
            Mark Delivered
          </Button>
        )}

        {/* <Button
          mode="outlined"
          onPress={() => router.push(`/order/${item._id}`)}
          style={styles.viewButton}
          textColor={Colors[colorScheme ?? "light"].primary}
        >
          View Details
        </Button> */}
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].primary}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <Searchbar
        placeholder="Search orders..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[
          styles.searchBar,
          { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
        ]}
        inputStyle={[
          styles.searchInput,
          { color: Colors[colorScheme ?? "light"].text },
        ]}
        iconColor={Colors[colorScheme ?? "light"].primary}
        theme={{ colors: { primary: Colors[colorScheme ?? "light"].primary } }}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={{ flexDirection: "row" }}
      >
        <Chip
          selected={statusFilter === null}
          onPress={() => setStatusFilter(null)}
          style={[
            styles.filterChip,
            { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
          ]}
          selectedColor={Colors[colorScheme ?? "light"].primary}
        >
          All
        </Chip>
        <Chip
          selected={statusFilter === "Food Processing"}
          onPress={() => setStatusFilter("Food Processing")}
          style={[
            styles.filterChip,
            { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
          ]}
          selectedColor={Colors[colorScheme ?? "light"].warning}
        >
          Food Processing
        </Chip>
        <Chip
          selected={statusFilter === "Out for delivery"}
          onPress={() => setStatusFilter("Out for delivery")}
          style={[
            styles.filterChip,
            { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
          ]}
          selectedColor={Colors[colorScheme ?? "light"].info}
        >
          Out for delivery
        </Chip>
        <Chip
          selected={statusFilter === "Delivered"}
          onPress={() => setStatusFilter("Delivered")}
          style={[
            styles.filterChip,
            { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
          ]}
          selectedColor={Colors[colorScheme ?? "light"].success}
        >
          Delivered
        </Chip>
      </ScrollView>

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
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  searchInput: {
    // Empty style to be overridden with dynamic color
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
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
    fontSize: 14,
    marginBottom: 4,
  },
  customer: {
    fontSize: 14,
    marginBottom: 4,
  },
  items: {
    fontSize: 14,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    marginBottom: 4,
  },
  phone: {
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
