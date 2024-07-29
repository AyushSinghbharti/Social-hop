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
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";

export default function ProfilePage () {
  const [image, setImage] = useState<string | null>(null);
  const [userName, setuserName] = useState("");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 pt-2 bg-white px-2">
      {/* Image Picker */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-60 aspect-square bg-gray-700 shadow-2xl rounded-full self-center"
        />
      ) : (
        <View className="w-60 aspect-square bg-slate-500 shadow-2xl rounded-full justify-center align-middle self-center">
          <Text className="color-white font-bold text-center text-l">
            No image is selected
          </Text>
        </View>
      )}
      <Text
        className="text-blue-500 font-semibold m-5 text-l self-center"
        onPress={pickImage}
      >
        Change
      </Text>

      {/* form */}
      <Text className="font-semibold text-m pb-1 text-gray-600">Username</Text>
      <TextInput
        placeholder="Username"
        value={userName}
        onChangeText={(text) => setuserName(text)}
        className="p-3 border-2 border-gray-300 rounded-lg shadow-2xl"
      />
      {/* Buttons */}
      <View className="gap-2 mt-auto mb-2" style={{marginTop: "auto"}}>
        <Button title="Update Profile" onPress={() => {}} />
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});