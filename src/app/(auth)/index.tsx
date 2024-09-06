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
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images-platform.99static.com//8731F2XCutThOEPWeGEatr1SeLs=/554x502:3048x2992/fit-in/500x500/projects-files/77/7714/771418/3ecfd419-611b-44ab-8fe9-e2b3b05e3dcc.png",
        }}
        style={styles.image}
      />
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          style={styles.input}
        />
      </View>
      {loading ? (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <ActivityIndicator style={styles.loader} color="white" />
        </View>
      ) : (
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button title="Sign in" onPress={() => signInWithEmail()} />
        </View>
      )}

      {loading ? (
        <View style={[styles.verticallySpaced, styles.mbAuto]}>
          <ActivityIndicator style={styles.loader} color="white" />
        </View>
      ) : (
        <View style={[styles.verticallySpaced, styles.mbAuto]}>
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
  image: {
    height: 224, // h-56 equivalent
    width: "100%",
    marginTop: "auto",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 12, // p-3 equivalent
    borderRadius: 8, // rounded-md equivalent
  },
  mt20: {
    marginTop: 20,
  },
  loader: {
    backgroundColor: "#93c5fd", // bg-blue-300 equivalent
    width: "100%",
    padding: 12, // p-3 equivalent
    alignItems: "center",
    borderRadius: 8, // rounded-lg equivalent
  },
  mbAuto: {
    marginBottom: "auto",
  },
});
