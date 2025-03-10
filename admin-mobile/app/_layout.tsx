import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "../context/AuthContext";
import { LightTheme, DarkTheme as PaperDarkTheme } from "../constants/Theme";
import Colors from "../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <PaperProvider
          theme={colorScheme === "dark" ? PaperDarkTheme : LightTheme}
        >
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
              headerTintColor: Colors[colorScheme ?? "light"].primary,
              headerTitleStyle: {
                color: Colors[colorScheme ?? "light"].text,
              },
              contentStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="food/add" options={{ title: "Add Food" }} />
            <Stack.Screen
              name="food/edit/[id]"
              options={{ title: "Edit Food" }}
            />
            <Stack.Screen
              name="order/[id]"
              options={{ title: "Order Details" }}
            />
          </Stack>
        </PaperProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
