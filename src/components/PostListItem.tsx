import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import Interface, { likes } from "~/assets/data/interface";
import { AdvancedImage } from "cloudinary-react-native";
//imports required for size change
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "~/src/lib/cloudinary";
import { Video, ResizeMode } from "expo-av";
import PostContent from "./PostContent";
import { supabase } from "../lib/supabase";
import { useAuth } from "../provides/AuthProvider";
import { sendLikeNotification } from "../app/utils/notifications";

export default function PostListItem({ post }: { post: Interface }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeRecord, setLikeRecord] = useState<likes | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (post.my_likes.length > 0) {
      setLikeRecord(post.my_likes[0]);
      setIsLiked(true);
    }
  }, [post.my_likes]);

  useEffect(() => {
    if (isLiked) {
      saveLike();
    } else {
      deleteLike();
    }
  }, [isLiked]);

  // const fetchLike = async () => {
  //   const { data, error } = await supabase
  //     .from("likes")
  //     .select("*")
  //     .eq("user_id", user?.id)
  //     .eq("post_id", post.id)
  //     .select();
  //   if (data && data?.length > 0) {
  //     setLikeRecord(data[0]);
  //     setIsLiked(true);
  //   }
  // };

  const saveLike = async () => {
    if (likeRecord) return;

    const result = await supabase
      .from("likes")
      .insert([{ user_id: user?.id, post_id: post.id }])
      .select();

    if (result.data){
      setLikeRecord(result.data[0]);
      sendLikeNotification(result.data[0]);
    } 

    // const updatedCount = (post.likes?.[0]?.count || 0) + 1;
    // if (post.likes) {
    //   post.likes[0] = { ...post.likes[0], count: updatedCount };
    // }

    //send notification to the owner of the post
  };

  const deleteLike = async () => {
    if (likeRecord) {
      const { data, error } = await supabase
        .from("likes")
        .delete()
        .eq("id", likeRecord.id);
      if (!error) setLikeRecord(null);
    }
  };

  const colorScheme = useColorScheme();
  const darkMode = colorScheme === "dark";

  const avatar = cld.image(post.user.avatar_url || "fuchqqnfvcmwu6qzsjiu");
  avatar.resize(
    thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
  );

  return (
    <View className="pt-2 bg-white dark:bg-black">
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

      {/* Content */}
      <TouchableOpacity onLongPress={() => setIsLiked(!isLiked)}>
        <PostContent post={post} />
      </TouchableOpacity>

      {/* Icons */}
      <View className="flex-row pl-3 pb-1 pr-3 items-center gap-4 mt-3">
        <AntDesign
          onPress={() => setIsLiked(!isLiked)}
          name={isLiked ? "heart" : "hearto"}
          size={25}
          color={!isLiked ? (darkMode ? "white" : "black") : "crimson"}
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
      {/* Content */}
      <Text className="ml-3 font-bold text-l dark:text-white">
        {post.likes?.[0]?.count || 0} Likes
      </Text>
      <Text className="ml-3 text-l mb-3 dark:text-white">
        <Text className="text-xl font-semibold">
          {post.user.username || "New user"}{" "}
        </Text>{" "}
        {post.caption || "**caption missing**"}
      </Text>
    </View>
  );
}
