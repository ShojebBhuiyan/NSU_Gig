import React, { useState } from "react";
import { View, FlatList, ScrollView, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Snackbar,
  Chip,
  useTheme,
} from "react-native-paper";
import { Food } from "../../types";
import { useCart } from "../../context/CartContext";
import { food_list, menu_list } from "../../assets/images/assets";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { addToCart } = useCart();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const handleAddToCart = (food: Food) => {
    addToCart(food);
    setSnackbarVisible(true);
  };

  const filteredFoods =
    selectedCategory === "All"
      ? food_list
      : food_list.filter((food) => food.category === selectedCategory);

  const renderFoodItem = ({ item }: { item: Food }) => (
    <Card style={styles.card}>
      <Card.Cover source={item.image} />
      <Card.Content>
        <Title style={styles.title}>{item.name}</Title>
        <Paragraph style={styles.description}>{item.description}</Paragraph>
        <Paragraph style={styles.price}>
          Price: ${item.price.toFixed(2)}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => handleAddToCart(item)}
          style={styles.addButton}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Add to Cart
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        <Chip
          selected={selectedCategory === "All"}
          onPress={() => setSelectedCategory("All")}
          style={styles.categoryChip}
          selectedColor={Colors[colorScheme ?? "light"].primary}
        >
          All
        </Chip>
        {menu_list.map((menu) => (
          <Chip
            key={menu.menu_name}
            selected={selectedCategory === menu.menu_name}
            onPress={() => setSelectedCategory(menu.menu_name)}
            style={styles.categoryChip}
            selectedColor={Colors[colorScheme ?? "light"].primary}
          >
            {menu.menu_name}
          </Chip>
        ))}
      </ScrollView>

      <FlatList
        data={filteredFoods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        Item added to cart
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  categoryScroll: {
    maxHeight: 60,
    backgroundColor: "#1A1A1A",
  },
  categoryContainer: {
    padding: 10,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: "#333333",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: "#1A1A1A",
  },
  title: {
    color: "#FFFFFF",
    marginTop: 8,
  },
  description: {
    color: "#CCCCCC",
  },
  price: {
    fontWeight: "bold",
    marginTop: 8,
    color: "#FF8C00",
  },
  addButton: {
    marginLeft: "auto",
  },
  snackbar: {
    backgroundColor: "#333333",
  },
});
