import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Admin } from "../types";
import { FeatureFlags } from "../constants/FeatureFlags";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (FeatureFlags.DISABLE_AUTH) {
      // When auth is disabled, set a mock admin user and token
      const mockToken = "mock-token";
      setAdmin({
        _id: "mock-admin",
        name: "Mock Admin",
        email: "mock@admin.com",
        token: mockToken,
      });
      axios.defaults.headers.common["Authorization"] = `Bearer ${mockToken}`;
      setLoading(false);
      return;
    }
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/admin/profile`);
        setAdmin(response.data);
      }
    } catch (error) {
      console.error("Error loading admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (FeatureFlags.DISABLE_AUTH) {
      // When auth is disabled, set mock admin without API call
      const mockToken = "mock-token";
      const mockAdmin = {
        _id: "mock-admin",
        name: "Mock Admin",
        email: email,
        token: mockToken,
      };
      await AsyncStorage.setItem("adminToken", mockToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${mockToken}`;
      setAdmin(mockAdmin);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
      });
      const { token, ...adminData } = response.data;
      await AsyncStorage.setItem("adminToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAdmin(adminData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (FeatureFlags.DISABLE_AUTH) {
      // When auth is disabled, just clear the mock admin
      setAdmin(null);
      return;
    }

    try {
      await AsyncStorage.removeItem("adminToken");
      delete axios.defaults.headers.common["Authorization"];
      setAdmin(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
