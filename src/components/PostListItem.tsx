import {
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import Interface from "~/assets/data/interface";
import { AdvancedImage } from "cloudinary-react-native";
//imports required for size change
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "~/src/lib/cloudinary";
import { Video, ResizeMode } from "expo-av";
import PostContent from "./PostContent";

export default function PostListItem({ post }: { post: Interface }) {
  const colorScheme = useColorScheme();
  const darkMode = colorScheme === "dark";

  if (!post.user.avatar_url) post.user.avatar_url = "fuchqqnfvcmwu6qzsjiu";
  const avatar = cld.image(post.user.avatar_url);
  avatar.resize(
    thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
  );

  return (
    <View className="bg-white dark:bg-black">
      {/* Header */}
      <View className="p-2 flex-row items-center gap-2">
        <AdvancedImage
          cldImg={avatar}
          className="w-12 aspect-square rounded-full border-gray-600 border-2 dark:border-cyan-100"
        />
        <Text className="font-semibold dark:text-white">
          {post.user.username || "New user"}
        </Text>
      </View>

      <PostContent post={post} />

      {/* Content */}
      <Text className="ml-3 m-2 text-xl mt-3 dark:text-white">
        {post.caption}
      </Text>

      {/* Icons */}
      <View className="flex-row pl-3 pb-3 pr-3 items-center gap-4 mt-2">
        <AntDesign
          name="hearto"
          size={23}
          color={darkMode ? "white" : "black"}
        />
        <Ionicons
          name="chatbubble-outline"
          size={25}
          color={darkMode ? "white" : "black"}
        />
        <Feather name="send" size={23} color={darkMode ? "white" : "black"} />

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Feather
            name="bookmark"
            size={25}
            color={darkMode ? "white" : "black"}
          />
        </View>
      </View>
    </View>
  );
}
