import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Chip,
  ActivityIndicator,
  List,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Order } from "../../types";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { admin } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!admin) {
      return;
    }

    fetchOrder();
  }, [admin, id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
      Alert.alert("Error", "Failed to fetch order details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    status: "pending" | "confirmed" | "delivered"
  ) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status });
      setOrder((prev) => (prev ? { ...prev, status } : null));
      Alert.alert("Success", `Order status updated to ${status}`);
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

  if (!order) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Title style={styles.errorText}>Order not found</Title>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.title}>Order #{order._id.slice(-6)}</Title>
            <Chip
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(order.status) },
              ]}
              textStyle={styles.statusText}
            >
              {order.status.toUpperCase()}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <Title style={styles.sectionTitle}>Customer Information</Title>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Name:</Paragraph>
            <Paragraph style={styles.infoValue}>{order.user.name}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Email:</Paragraph>
            <Paragraph style={styles.infoValue}>{order.user.email}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Address:</Paragraph>
            <Paragraph style={styles.infoValue}>{order.address}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Phone:</Paragraph>
            <Paragraph style={styles.infoValue}>{order.phone}</Paragraph>
          </View>

          <Divider style={styles.divider} />

          <Title style={styles.sectionTitle}>Order Items</Title>
          {order.items.map((item) => (
            <List.Item
              key={item._id}
              title={item.food.name}
              titleStyle={styles.itemTitle}
              description={`Price: $${item.food.price.toFixed(2)} x ${
                item.quantity
              }`}
              descriptionStyle={styles.itemDescription}
              right={() => (
                <Paragraph style={styles.itemTotal}>
                  ${(item.food.price * item.quantity).toFixed(2)}
                </Paragraph>
              )}
              style={styles.listItem}
            />
          ))}

          <Divider style={styles.divider} />

          <View style={styles.totalRow}>
            <Title style={styles.totalLabel}>Total Amount:</Title>
            <Title style={styles.totalValue}>
              ${order.totalAmount.toFixed(2)}
            </Title>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Update Order Status</Title>
          <View style={styles.actionsContainer}>
            {order.status === "pending" && (
              <Button
                mode="contained"
                onPress={() => updateOrderStatus("confirmed")}
                style={styles.actionButton}
                buttonColor={Colors[colorScheme ?? "light"].info}
              >
                Confirm Order
              </Button>
            )}

            {order.status === "confirmed" && (
              <Button
                mode="contained"
                onPress={() => updateOrderStatus("delivered")}
                style={styles.actionButton}
                buttonColor={Colors[colorScheme ?? "light"].success}
              >
                Mark as Delivered
              </Button>
            )}

            {order.status === "delivered" && (
              <Paragraph style={styles.completedText}>
                This order has been delivered and completed.
              </Paragraph>
            )}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        style={styles.backButton}
        textColor="#FFFFFF"
      >
        Back to Orders
      </Button>
    </ScrollView>
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
    padding: 16,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  actionsCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: "#1A1A1A",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  divider: {
    backgroundColor: "#333333",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontWeight: "bold",
    color: "#CCCCCC",
  },
  infoValue: {
    flex: 1,
    color: "#FFFFFF",
  },
  listItem: {
    padding: 0,
    paddingVertical: 4,
  },
  itemTitle: {
    color: "#FFFFFF",
  },
  itemDescription: {
    color: "#CCCCCC",
  },
  itemTotal: {
    color: "#4CAF50",
    fontWeight: "bold",
    alignSelf: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  totalValue: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  completedText: {
    color: "#4CAF50",
    fontStyle: "italic",
    textAlign: "center",
  },
  backButton: {
    margin: 16,
    borderColor: "#333333",
  },
  errorText: {
    color: "#CF6679",
    marginBottom: 16,
  },
});
