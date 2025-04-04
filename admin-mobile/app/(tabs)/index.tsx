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

  // Helper function to format currency with commas for thousands
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

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
        axios.get(`${API_URL}/order/list`),
        axios.get(`${API_URL}/food/list`),
      ]);

      const orders =
        ordersRes.data && ordersRes.data.success
          ? ordersRes.data.data
          : ordersRes.data;
      const foods =
        foodsRes.data && foodsRes.data.success
          ? foodsRes.data.data
          : foodsRes.data;

      console.log("Dashboard orders:", orders);
      console.log("Dashboard foods:", foods);

      const pendingOrders = orders.filter(
        (order: any) => order.status === "Food Processing"
      ).length;
      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + order.amount,
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
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <Title
        style={[styles.header, { color: Colors[colorScheme ?? "light"].text }]}
      >
        Admin Dashboard
      </Title>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Card
            style={[
              styles.statsCard,
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <Title
                style={[
                  styles.cardTitle,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
                numberOfLines={2}
              >
                Total Orders
              </Title>
              <Paragraph style={styles.statValue}>
                {stats.totalOrders}
              </Paragraph>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.statsCard,
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <Title
                style={[
                  styles.cardTitle,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
                numberOfLines={2}
              >
                Processing Orders
              </Title>
              <Paragraph style={styles.statValue}>
                {stats.pendingOrders}
              </Paragraph>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card
            style={[
              styles.statsCard,
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <Title
                style={[
                  styles.cardTitle,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
                numberOfLines={2}
              >
                Total Foods
              </Title>
              <Paragraph style={styles.statValue}>{stats.totalFoods}</Paragraph>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.statsCard,
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <Title
                style={[
                  styles.cardTitle,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
                numberOfLines={2}
              >
                Total Revenue
              </Title>
              <Paragraph style={styles.statValue}>
                ${formatCurrency(stats.totalRevenue)}
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
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
    marginBottom: 8,
  },
  statsContainer: {
    padding: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  statsCard: {
    width: "48%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: 10,
  },
  cardContent: {
    padding: 20,
    paddingBottom: 24,
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 12,
    flexWrap: "wrap",
    lineHeight: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: "#4CAF50",
    flexWrap: "wrap",
    lineHeight: 24,
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    marginBottom: 16,
  },
});
