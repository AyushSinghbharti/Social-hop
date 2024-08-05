import {
  Image,
  StyleSheet,
  Text,
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

export default function PostListItem({ post }: { post: Interface }) {
  const { width } = useWindowDimensions();
  const image = cld.image(post.image);
  image.resize(thumbnail().width(width).height(width));

  if(!post.user.avatar_url) post.user.avatar_url = "fuchqqnfvcmwu6qzsjiu";
  const avatar = cld.image(post.user.avatar_url);
  avatar.resize(
    thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
  );

  return (
    <View className="bg-white">
      {/* Header */}
      <View className="p-2 flex-row items-center gap-2">
        <AdvancedImage
          cldImg={avatar}
          className="w-12 aspect-square rounded-full border-gray-600 border-2"
        />
        <Text className="font-semibold">{post.user.username || "New user"}</Text>
      </View>
      
      {/* image */}
      <AdvancedImage cldImg={image} className="w-full aspect-square" />
      {/* Content */}
      <Text className="ml-3 m-2 text-xl" >{post.caption}</Text>


      {/* Icons */}
      <View className="flex-row pl-3 pb-3 pr-3 items-center gap-3">
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
