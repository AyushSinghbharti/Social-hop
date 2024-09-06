import React, { useEffect, useState } from "react";
import {
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import { AdvancedImage } from "cloudinary-react-native";
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "~/src/lib/cloudinary";
import PostContent from "./PostContent";
import { supabase } from "../lib/supabase";
import { useAuth } from "../provides/AuthProvider";
import Interface, { likes } from "~/assets/data/interface";
import { sendLikeNotification } from "../app/utils/notifications";

export default function PostListItem({ post }: { post: Interface }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeRecord, setLikeRecord] = useState<likes | null>(null);
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const darkMode = colorScheme === "dark";

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

    // Updating likes
    if (isLiked) {
      const updatedCount = (post.likes?.[0]?.count || 0) + 1;
      post.likes[0] = { ...post.likes[0], count: updatedCount };
    } else {
      const updatedCount =
        post.likes?.[0]?.count > 0 ? post.likes?.[0]?.count - 1 : 0;
      post.likes[0] = { ...post.likes[0], count: updatedCount };
    }
  }, [isLiked]);

  const saveLike = async () => {
    if (likeRecord) return;

    const result = await supabase
      .from("likes")
      .insert([{ user_id: user?.id, post_id: post.id }])
      .select();

    if (result.data) {
      setLikeRecord(result.data[0]);

      // Sending notification to the owner of the post
      sendLikeNotification(result.data[0]);
    }
  };

  const deleteLike = async () => {
    if (likeRecord) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", likeRecord.id);
      if (!error) setLikeRecord(null);
    }
  };

  const avatar = cld.image(post.user.avatar_url || "fuchqqnfvcmwu6qzsjiu");
  avatar.resize(
    thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
  );

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <AdvancedImage
          cldImg={avatar}
          style={[styles.avatar, darkMode && styles.darkAvatar]}
        />
        <Text style={[styles.username, darkMode && styles.darkText]}>
          {post.user.username || "New user"}
        </Text>
      </View>

      {/* Content */}
      <TouchableOpacity onLongPress={() => setIsLiked(!isLiked)}>
        <PostContent post={post} />
      </TouchableOpacity>

      {/* Icons */}
      <View style={styles.icons}>
        <AntDesign
          onPress={() => setIsLiked(!isLiked)}
          name={isLiked ? "heart" : "hearto"}
          size={25}
          color={isLiked ? "crimson" : darkMode ? "white" : "black"}
        />
        <Ionicons
          name="chatbubble-outline"
          size={25}
          color={darkMode ? "white" : "black"}
        />
        <Feather name="send" size={23} color={darkMode ? "white" : "black"} />
        <View style={styles.bookmarkContainer}>
          <Feather
            name="bookmark"
            size={25}
            color={darkMode ? "white" : "black"}
          />
        </View>
      </View>

      {/* Text Content */}
      <Text style={[styles.likesText, darkMode && styles.darkText]}>
        {post.likes?.[0]?.count || 0} Likes
      </Text>
      <Text style={[styles.captionText, darkMode && styles.darkText]}>
        <Text style={styles.usernameBold}>
          {post.user.username || "New user"}{" "}
        </Text>
        {post.caption || "**caption missing**"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  darkContainer: {
    backgroundColor: "#1a1a1a", // dark mode background
    borderBottomColor: "#333",
  },
  header: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#d1d5db", // light gray border for light mode
  },
  darkAvatar: {
    borderColor: "#4fd1c5", // teal border for dark mode
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
  },
  darkText: {
    color: "white",
  },
  icons: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 4,
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  bookmarkContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  likesText: {
    marginLeft: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  captionText: {
    marginLeft: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  usernameBold: {
    fontWeight: "600",
    fontSize: 18,
  },
});
