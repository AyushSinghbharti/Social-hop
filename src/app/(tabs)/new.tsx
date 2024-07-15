import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";

const newPost = () => {
  const [caption, setCaption] = useState("");
  return (
    <View className="p-3 items-center flex-1">
      {/* IMage Pciker */}
      <Image
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg",
        }}
        className="w-60 aspect-[3/4] bg-gray-700 shadow-2xl rounded-xl"
      />
      <Text
        className="text-blue-500 font-semibold m-5 text-l"
        onPress={() => {}}
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
        <Pressable className="bg-blue-500 w-full p-3 items-center rounded-lg mt-auto">
          <Text className="text-white font-semibold">Share</Text>
        </Pressable>
      </View>

    </View>
  );
};

export default newPost;
