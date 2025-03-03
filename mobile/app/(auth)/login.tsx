import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title, HelperText } from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Welcome Back</Title>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        theme={{ colors: { primary: Colors[colorScheme ?? "light"].primary } }}
        textColor="#FFFFFF"
        outlineColor="#333333"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        theme={{ colors: { primary: Colors[colorScheme ?? "light"].primary } }}
        textColor="#FFFFFF"
        outlineColor="#333333"
      />

      {error ? (
        <HelperText type="error" style={styles.error}>
          {error}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        buttonColor={Colors[colorScheme ?? "light"].primary}
      >
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/(auth)/register")}
        style={styles.button}
        textColor="#FFFFFF"
      >
        Don't have an account? Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: "#FFFFFF",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: "#FF6B6B",
  },
});
