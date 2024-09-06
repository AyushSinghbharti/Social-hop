import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/provides/AuthProvider";
import { cld, uploadImage } from "~/src/lib/cloudinary";
import { AdvancedImage } from "cloudinary-react-native";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import CustomTextInput from "~/src/components/CustomTextInput";

export default function ProfilePage() {
  const [image, setImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const { session } = useAuth();
  const colorScheme = useColorScheme(); // Detect light or dark mode

  const isDarkMode = colorScheme === "dark";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url, bio`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserName(data.username);
        setAvatarUrl(data.avatar_url);
        setBio(data.bio);

        const image = cld.image(data.avatar_url);
        setImage(image.toURL());
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    if (!image || (!userName && !bio)) {
      Alert.alert("Please upload image, username, and bio");
      return;
    }

    setLoading(true);
    const response = await uploadImage(image);
    setAvatarUrl(response?.public_id);

    try {
      if (!session?.user) throw new Error("No user on the session!");
      const updates = {
        id: session?.user.id,
        username: userName,
        avatar_url: response?.public_id,
        bio,
        updated_at: new Date(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session?.user.id)
        .select();

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.darkBackground]}>
        <ActivityIndicator size={50} color={isDarkMode ? "#60a5fa" : "#3b82f6"} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={[styles.container, isDarkMode && styles.darkBackground]}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          {/* Image Picker */}
          {image ? (
            <Image source={{ uri: image }} style={styles.avatarImage} />
          ) : avatarUrl ? (
            <AdvancedImage
              cldImg={cld
                .image(avatarUrl)
                .resize(thumbnail().width(200).height(200))}
              style={styles.avatarImage}
            />
          ) : (
            <View style={[styles.placeholderContainer, isDarkMode && styles.darkPlaceholder]}>
              <Text style={[styles.placeholderText, isDarkMode && styles.darkPlaceholderText]}>
                No image is selected
              </Text>
            </View>
          )}
          <Text
            style={[styles.changeText, isDarkMode && styles.darkChangeText]}
            onPress={pickImage}
          >
            Change
          </Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <CustomTextInput
              label="Username"
              placeholder="Username"
              value={userName}
              onChangeText={setUserName}
              multiline
              textInputStyle={{ color: isDarkMode ? "#fff" : "#000" }}
            />

            <CustomTextInput
              label="Bio"
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
              textInputStyle={{ color: isDarkMode ? "#fff" : "#000" }}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Button title="Update Profile" onPress={updateProfile} />
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  darkBackground: {
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  avatarImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignSelf: "center",
    backgroundColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  placeholderContainer: {
    width: 240,
    height: 240,
    backgroundColor: "#64748b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 120,
    alignSelf: "center",
  },
  darkPlaceholder: {
    backgroundColor: "#374151",
  },
  placeholderText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  darkPlaceholderText: {
    color: "#d1d5db",
  },
  changeText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  darkChangeText: {
    color: "#60a5fa",
  },
  formContainer: {
    marginTop: 24,
    gap: 12,
  },
  buttonsContainer: {
    marginTop: "auto",
    marginBottom: 16,
    gap: 12,
  },
});
