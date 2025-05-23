import { Stack } from "expo-router";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
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
      <Stack.Screen
        name="login"
        options={{
          title: "Admin Login",
        }}
      />
    </Stack>
  );
}
