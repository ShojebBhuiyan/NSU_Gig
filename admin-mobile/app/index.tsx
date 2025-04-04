import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Colors from "../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Index() {
  const { admin, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <View
        style={[
          styles.container,
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

  if (admin) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
