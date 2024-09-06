import { Redirect, Tabs } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useAuth } from "~/src/provides/AuthProvider";
import { useColorScheme } from "react-native";
import NotificationProvider from "~/src/provides/NotificationProvider";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  if (!isAuthenticated) return <Redirect href={"/(auth)"} />;

  return (
    <NotificationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDarkMode ? "white" : "black",
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: isDarkMode ? "black" : "white" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: "For you",
            headerTitleStyle: { color: isDarkMode ? "white" : "black" },
            headerStyle: { backgroundColor: isDarkMode ? "black" : "white" },
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="new"
          options={{
            headerTitle: "Add new post",
            headerTitleStyle: { color: isDarkMode ? "white" : "black" },
            headerStyle: { backgroundColor: isDarkMode ? "black" : "white" },
            tabBarIcon: ({ color }) => (
              <Feather name="plus-square" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: "Profile Page",
            headerTitleStyle: { color: isDarkMode ? "white" : "black" },
            headerStyle: { backgroundColor: isDarkMode ? "black" : "white" },
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={30} color={color} />
            ),
          }}
        />
      </Tabs>
    </NotificationProvider>
  );
}

//updated