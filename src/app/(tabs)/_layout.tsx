import { Redirect, Tabs } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useAuth } from "~/src/provides/AuthProvider";

export default function TabsLayout() {
  const {isAuthenticated} = useAuth();

  if(!isAuthenticated) return <Redirect href={"/(auth)"} />
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "black", tabBarShowLabel: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "For you",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          headerTitle: "Add new post",
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile Page",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
