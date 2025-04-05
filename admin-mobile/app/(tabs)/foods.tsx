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
      const response = await axios.get(`${API_URL}/food/list`);
      if (response.data && response.data.success) {
        setFoods(response.data.data);
        console.log("Foods data:", response.data.data);
      } else {
        setFoods(response.data);
        console.log("Foods data:", response.data);
      }
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
              await axios.post(`${API_URL}/food/remove`, {
                data: { id },
              });
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
    <Card
      style={[
        styles.card,
        { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
      ]}
    >
      <Card.Content>
        <Title
          style={[
            styles.cardTitle,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          {item.name}
        </Title>
        <Paragraph
          style={[
            styles.description,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          {item.description}
        </Paragraph>
        <Paragraph style={styles.price}>
          Price: ${item.price.toFixed(2)}
        </Paragraph>
        <Paragraph
          style={[
            styles.category,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Category: {item.category}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        {/* <Button
          mode="outlined"
          onPress={() => router.push(`/food/edit/${item._id}`)}
          style={styles.actionButton}
          textColor={Colors[colorScheme ?? "light"].primary}
        >
          Edit
        </Button> */}
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
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <Searchbar
        placeholder="Search foods..."
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
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    margin: 16,
  },
  searchInput: {
    // Empty style to be overridden with dynamic color
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  description: {
    marginBottom: 8,
  },
  price: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  category: {
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
