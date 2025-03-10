import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  FAB,
  Searchbar,
} from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Food } from "../../types";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

export default function FoodsScreen() {
  const { admin } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (admin) {
      fetchFoods();
    } else {
      router.replace("/(auth)/login");
    }
  }, [admin]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/foods`);
      setFoods(response.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this food item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/foods/${id}`);
              setFoods(foods.filter((food) => food._id !== id));
            } catch (error) {
              console.error("Error deleting food:", error);
              Alert.alert("Error", "Failed to delete food item");
            }
          },
        },
      ]
    );
  };

  const filteredFoods = searchQuery
    ? foods.filter(
        (food) =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : foods;

  const renderFoodItem = ({ item }: { item: Food }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.name}</Title>
        <Paragraph style={styles.description}>{item.description}</Paragraph>
        <Paragraph style={styles.price}>
          Price: ${item.price.toFixed(2)}
        </Paragraph>
        <Paragraph style={styles.category}>Category: {item.category}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => router.push(`/food/edit/${item._id}`)}
          style={styles.actionButton}
          textColor={Colors[colorScheme ?? "light"].primary}
        >
          Edit
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleDeleteFood(item._id)}
          style={styles.actionButton}
          textColor={Colors[colorScheme ?? "light"].error}
        >
          Delete
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
        placeholder="Search foods..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor={Colors[colorScheme ?? "light"].primary}
        theme={{ colors: { primary: Colors[colorScheme ?? "light"].primary } }}
      />

      <FlatList
        data={filteredFoods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchFoods}
      />

      <FAB
        icon="plus"
        style={[
          styles.fab,
          { backgroundColor: Colors[colorScheme ?? "light"].primary },
        ]}
        onPress={() => router.push("/food/add")}
        color="#FFFFFF"
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
    backgroundColor: "#1A1A1A",
  },
  searchInput: {
    color: "#FFFFFF",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  cardTitle: {
    color: "#FFFFFF",
  },
  description: {
    color: "#CCCCCC",
    marginBottom: 8,
  },
  price: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  category: {
    color: "#CCCCCC",
    fontStyle: "italic",
  },
  actionButton: {
    marginLeft: 8,
    borderColor: "#333333",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
