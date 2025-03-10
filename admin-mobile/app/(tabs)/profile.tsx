import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Divider,
} from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ProfileScreen() {
  const { admin, logout } = useAuth();
  const colorScheme = useColorScheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!admin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Title style={styles.title}>Please log in to continue</Title>
        <Button
          mode="contained"
          onPress={() => router.push("/(auth)/login")}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Go to Login
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={100}
          label={admin.name.charAt(0)}
          style={styles.avatar}
          color="#FFFFFF"
        />
        <Title style={styles.name}>{admin.name}</Title>
        <Paragraph style={styles.email}>{admin.email}</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Admin Information</Title>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>ID:</Paragraph>
            <Paragraph style={styles.infoValue}>{admin._id}</Paragraph>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Name:</Paragraph>
            <Paragraph style={styles.infoValue}>{admin.name}</Paragraph>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Email:</Paragraph>
            <Paragraph style={styles.infoValue}>{admin.email}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <Divider style={styles.divider} />

          <Button
            mode="contained"
            icon="food"
            onPress={() => router.push("/food/add")}
            style={styles.actionButton}
            buttonColor={Colors[colorScheme ?? "light"].primary}
          >
            Add New Food
          </Button>

          <Button
            mode="contained"
            icon="format-list-bulleted"
            onPress={() => router.push("/(tabs)/foods")}
            style={styles.actionButton}
            buttonColor={Colors[colorScheme ?? "light"].secondary}
          >
            Manage Foods
          </Button>

          <Button
            mode="contained"
            icon="clipboard-list"
            onPress={() => router.push("/(tabs)/orders")}
            style={styles.actionButton}
            buttonColor={Colors[colorScheme ?? "light"].info}
          >
            Manage Orders
          </Button>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor={Colors[colorScheme ?? "light"].error}
      >
        Logout
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#1A1A1A",
  },
  avatar: {
    backgroundColor: Colors.light.primary,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  card: {
    margin: 16,
    backgroundColor: "#1A1A1A",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  divider: {
    backgroundColor: "#333333",
    marginBottom: 16,
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
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
});
