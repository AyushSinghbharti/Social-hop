import { Slot, Stack, Tabs } from "expo-router";
import AuthProvider from "../provides/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
