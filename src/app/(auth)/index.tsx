import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { supabase } from "~/src/lib/supabase";
import Button from "~/src/components/Button";
import { Redirect } from "expo-router";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    alert("logged in");
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwH--J-ZMUg8puNfUxE6YXQi3yVHuAORDxow&s",
        }}
        className="h-56 w-56 mt-auto"
      />
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          className="border border-gray-400 p-3 rounded-md"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          className="border border-gray-400 p-3 rounded-md"
        />
      </View>
      {loading ? (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <ActivityIndicator className="bg-blue-300 w-full p-3 items-center rounded-lg mt-auto color-white" />
        </View>
      ) : (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button title="Sign in" onPress={() => signInWithEmail()} />
        </View>
      )}

      {loading ? (
        <View style={[styles.verticallySpaced]} className="mb-auto">
          <ActivityIndicator className="bg-blue-300 w-full p-3 items-center rounded-lg mt-auto color-white" />
        </View>
      ) : (
        <View style={styles.verticallySpaced} className="mb-auto">
          <Button title="Sign up" onPress={() => signUpWithEmail()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
