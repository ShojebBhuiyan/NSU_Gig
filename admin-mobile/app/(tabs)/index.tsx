import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

export default function DashboardScreen() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalFoods: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (admin) {
      fetchStats();
    } else {
      router.replace("/(auth)/login");
    }
  }, [admin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [ordersRes, foodsRes] = await Promise.all([
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/foods`),
      ]);

      const orders = ordersRes.data;
      const foods = foodsRes.data;

      const pendingOrders = orders.filter(
        (order) => order.status === "pending"
      ).length;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalFoods: foods.length,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
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

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>Admin Dashboard</Title>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Total Orders</Title>
            <Paragraph style={styles.statValue}>{stats.totalOrders}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Pending Orders</Title>
            <Paragraph style={styles.statValue}>
              {stats.pendingOrders}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Total Foods</Title>
            <Paragraph style={styles.statValue}>{stats.totalFoods}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Total Revenue</Title>
            <Paragraph style={styles.statValue}>
              ${stats.totalRevenue.toFixed(2)}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => router.push("/food/add")}
          style={styles.actionButton}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Add New Food
        </Button>

        <Button
          mode="contained"
          icon="view-list"
          onPress={() => router.push("/(tabs)/foods")}
          style={styles.actionButton}
          buttonColor={Colors[colorScheme ?? "light"].secondary}
        >
          Manage Foods
        </Button>

        <Button
          mode="contained"
          icon="receipt"
          onPress={() => router.push("/(tabs)/orders")}
          style={styles.actionButton}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Manage Orders
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 16,
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  statsCard: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  cardTitle: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    color: "#4CAF50",
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    marginBottom: 16,
  },
});
