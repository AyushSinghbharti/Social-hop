import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
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
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { session } = useAuth();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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
    if (!image && !userName && !bio) {
      Alert.alert("Please fill all spaces");
      return;
    }

    //Uploading image at cloudinary
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

      console.log(data);
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
      <ActivityIndicator
        className="self-center flex-1 justify-center align-center color-blue-400"
        size={50}
      />
    );
  }

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 pt-2 bg-white px-2">
          {/* Image Picker */}
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-60 aspect-square bg-gray-700 shadow-black drop-shadow-2xl rounded-full self-center"
            />
          ) : avatarUrl ? (
            <AdvancedImage
              cldImg={cld.image(avatarUrl)}
              className="w-60 aspect-square border-gray-500 border-2 rounded-full self-center"
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
          <View className="gap-3">
            <CustomTextInput
              label="Username"
              placeholder="Username"
              value={userName}
              onChangeText={setUserName}
              multiline
            />

            <CustomTextInput
              label="Bio"
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          {/* Buttons */}
          <View className="gap-2 mt-auto mb-2">
            <Button title="Update Profile" onPress={updateProfile} />
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
