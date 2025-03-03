import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Button, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CartItem } from "../../types";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function CartScreen() {
  const { items, updateQuantity, getTotalAmount } = useCart();
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const handleCheckout = () => {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }
    router.push("place-order");
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.itemInfo}>
          <Title style={styles.title}>{item.name}</Title>
          <Paragraph style={styles.description}>
            Price: ${item.price.toFixed(2)}
          </Paragraph>
          <Paragraph style={styles.total}>
            Total: ${(item.price * item.quantity).toFixed(2)}
          </Paragraph>
        </View>
        <View style={styles.quantityControls}>
          <IconButton
            icon="minus"
            onPress={() => updateQuantity(item._id, item.quantity - 1)}
            iconColor={Colors[colorScheme ?? "light"].primary}
          />
          <Paragraph style={styles.quantity}>{item.quantity}</Paragraph>
          <IconButton
            icon="plus"
            onPress={() => updateQuantity(item._id, item.quantity + 1)}
            iconColor={Colors[colorScheme ?? "light"].primary}
          />
        </View>
      </Card.Content>
    </Card>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Title style={styles.emptyText}>Your cart is empty</Title>
        <Button
          mode="contained"
          onPress={() => router.push("/(tabs)")}
          style={styles.browseButton}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Browse Foods
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Title style={styles.totalAmount}>
              Total: ${getTotalAmount().toFixed(2)}
            </Title>
            <Button
              mode="contained"
              onPress={handleCheckout}
              style={styles.checkoutButton}
              buttonColor={Colors[colorScheme ?? "light"].primary}
            >
              Proceed to Checkout
            </Button>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    color: "#FFFFFF",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
  },
  description: {
    color: "#CCCCCC",
  },
  total: {
    color: "#FF8C00",
    fontWeight: "bold",
  },
  quantity: {
    color: "#FFFFFF",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#333333",
    gap: 16,
  },
  totalAmount: {
    color: "#FFFFFF",
  },
  checkoutButton: {
    marginTop: 8,
  },
  browseButton: {
    width: "80%",
  },
});
