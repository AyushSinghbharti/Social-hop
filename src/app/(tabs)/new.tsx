import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "../../components/Button";
import { uploadImage } from "~/src/lib/cloudinary";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/provides/AuthProvider";
import { router } from "expo-router";
import CustomTextInput from "~/src/components/CustomTextInput";
import { Video, ResizeMode } from "expo-av";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"video" | "image" | undefined>();
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const videoRef = useRef<Video>(null);
  const colorScheme = useColorScheme(); // Detect light or dark mode

  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    if (!media) {
      pickImage();
    }
  }, [media]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      setMediaType(result.assets[0].type);
    }
  };

  const createPost = async () => {
    setLoading(true);
    if (!media || !caption) {
      return;
    }
    const response = await uploadImage(media);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          caption,
          image: response?.public_id,
          user_id: session?.user.id,
          media_type: mediaType,
        },
      ])
      .select();
    setLoading(false);
    console.log("data", data);
    console.log("error", error);

    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
    router.push("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.content, isDarkMode && styles.darkContent]}>
          {/* Image Picker */}
          {!media ? (
            <View style={[styles.placeholderContainer, isDarkMode && styles.darkPlaceholderContainer]}>
              <Text style={[styles.placeholderText, isDarkMode && styles.darkPlaceholderText]}>
                No media is selected
              </Text>
            </View>
          ) : mediaType === "image" ? (
            <Image
              source={{ uri: media }}
              style={[styles.image, isDarkMode && styles.darkImage]}
            />
          ) : (
            <Video
              ref={videoRef}
              style={[styles.video, isDarkMode && styles.darkVideo]}
              source={{ uri: media }}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay
            />
          )}

          <Text
            style={[styles.changeText, isDarkMode && styles.darkChangeText]}
            onPress={pickImage}
          >
            Change
          </Text>

          <CustomTextInput
            label="Caption"
            value={caption}
            onChangeText={setCaption}
            placeholder="Enter name of your post"
            textInputStyle={isDarkMode ? styles.darkTextInput : styles.lightTextInput}
          />

          {/* Button */}
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator
                size={40}
                color={isDarkMode ? "#60a5fa" : "#3b82f6"}
                style={styles.loader}
              />
            ) : (
              <Button title={"Share Post"} onPress={createPost} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  darkContainer: {
    backgroundColor: "#000",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 12,
    alignItems: "center",
    flex: 1,
  },
  darkContent: {
    backgroundColor: "#1f2937", // dark-gray
  },
  placeholderContainer: {
    width: 240,
    aspectRatio: 3 / 4,
    backgroundColor: "#64748b", // slate-500 equivalent
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  darkPlaceholderContainer: {
    backgroundColor: "#374151", // dark-gray
  },
  placeholderText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  darkPlaceholderText: {
    color: "#d1d5db", // light-gray
  },
  image: {
    width: 240,
    aspectRatio: 3 / 4,
    backgroundColor: "#374151", // gray-700 equivalent
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 15,
  },
  darkImage: {
    backgroundColor: "#1f2937", // dark-gray
  },
  video: {
    width: "90%",
    aspectRatio: 1,
    borderRadius: 15,
  },
  darkVideo: {
    borderColor: "#374151", // dark-gray
  },
  changeText: {
    color: "#3b82f6", // blue-500 equivalent
    fontWeight: "600",
    marginVertical: 20,
    fontSize: 16,
  },
  darkChangeText: {
    color: "#60a5fa", // light-blue
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 16,
    marginTop: "auto",
  },
  loader: {
    alignSelf: "center",
  },
  textInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
  lightTextInput: {
    borderColor: '#d1d5db', // light-gray
    backgroundColor: '#fff',
    color: '#000',
  },
  darkTextInput: {
    borderColor: '#4b5563', // dark-gray
    backgroundColor: '#1f2937', // dark-gray
    color: '#fff',
  },
});
