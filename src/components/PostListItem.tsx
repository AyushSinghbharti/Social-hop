import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import Interface from "~/assets/data/interface";

export default function PostListItem({post} : Interface.Post) {
//   const post = props.post;

  return (
    <View className="bg-white">
      {/* Header */}
      <View className="p-2 flex-row items-center gap-2">
        <Image
          source={{ uri: post.user.image_url }}
          className="w-12 aspect-square rounded-full"
        />
        <Text className="font-semibold">{post.user.username}</Text>
      </View>
      {/* image */}
      <Image
        source={{ uri: post.image_url }}
        className="w-full aspect-square"
      />

      {/* Icons */}
      <View className="flex-row p-3 items-center gap-3">
        <AntDesign name="heart" size={22} color="black" />
        <Ionicons name="chatbubble-outline" size={22} color="black" />
        <Feather name="send" size={22} color="black" />

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Feather name="bookmark" size={22} color="black" />
        </View>
      </View>
    </View>
  );
}
