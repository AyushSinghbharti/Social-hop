import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
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

  useEffect(() => {
    if (!media) {
      pickImage();
    }
  }, [media]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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
    //Upload image
    if (!media || !caption) {
      return;
    }
    const response = await uploadImage(media);

    //Uploading image at supabase
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
      style={{ flex: 1 }}
      className="dark:bg-black"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-3 items-center flex-1">
          {/* IMage Picker */}
          {!media ? (
            <View className="w-60 aspect-[3/4] bg-slate-500 shadow-2xl rounded-xl justify-center align-middle">
              <Text className="color-white font-bold text-center text-l">
                No media is selected
              </Text>
            </View>
          ) : mediaType === "image" ? (
            <Image
              source={{ uri: media }}
              className="w-60 aspect-[3/4] bg-gray-700 shadow-2xl rounded-xl"
            />
          ) : (
            <Video
              ref={videoRef}
              style={{ width: "90%", aspectRatio: 1, borderRadius: 15 }}
              source={{
                uri: media,
              }}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay
            />
          )}

          <Text
            className="text-blue-500 font-semibold m-5 text-l"
            onPress={pickImage}
          >
            Change
          </Text>

          <CustomTextInput
            label="Caption"
            value={caption}
            onChangeText={setCaption}
            placeholder="Enter name of your post"
          />

          {/* Button */}
          <View className="w-full mb-2" style={{ marginTop: "auto" }}>
            {loading ? (
              <ActivityIndicator
                size={40}
                className=" self-center color-blue-300 m-auto"
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
