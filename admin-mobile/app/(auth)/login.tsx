import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Title, HelperText } from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

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
      <View style={styles.logoContainer}>
        <Title style={styles.title}>Admin Dashboard</Title>
      </View>

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
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  error: {
    color: "#F44336",
    marginBottom: 8,
  },
});
