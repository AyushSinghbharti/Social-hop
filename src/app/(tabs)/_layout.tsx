import { Tabs } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "black", tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "For you",
          tabBarIcon: ({color}) => <FontAwesome name="home" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          headerTitle: "Add new post",
          tabBarIcon: ({color}) => <Feather name="plus-square" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile Page",
          tabBarIcon: ({color}) => <FontAwesome name="user" size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}
