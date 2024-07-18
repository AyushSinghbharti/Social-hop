import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "../../components/Button";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, [image]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="p-3 items-center flex-1">
      {/* IMage Pciker */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-60 aspect-[3/4] bg-gray-700 shadow-2xl rounded-xl"
        />
      ) : (
        <View className="w-60 aspect-[3/4] bg-slate-500 shadow-2xl rounded-xl justify-center align-middle">
          <Text className="color-white font-bold text-center text-l">
            No image is selected
          </Text>
        </View>
      )}

      <Text
        className="text-blue-500 font-semibold m-5 text-l"
        onPress={pickImage}
      >
        Change
      </Text>

      {/* Text Input */}
      <TextInput
        value={caption}
        onChangeText={(text) => setCaption(text)}
        placeholder="Enter name of your post"
        className="w-full p-3"
      />

      {/* Button */}
      <View className="w-full mt-48">
        <Button title={"Share Post"} />
      </View>
    </View>
  );
};