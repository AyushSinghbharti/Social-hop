import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PostListItem from "~/src/components/PostListItem";
import Post from "~/assets/data/interface";
import { supabase } from "~/src/lib/supabase";
import { useFocusEffect } from "expo-router";
import { useAuth } from "~/src/provides/AuthProvider";

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, isLoading] = useState(false);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [])
  );

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    isLoading(true);
    let { data, error } = await supabase
      .from("posts")
      .select("*, user: profiles(*), my_likes: likes(*), likes(count)")
      .eq("my_likes.user_id", user?.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.log("error message", error);
      alert(error.message);
    }

    setPosts(data);
    isLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size={50}
          color="#60a5fa"
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        contentContainerStyle={styles.flatListContent}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // dark:bg-black equivalent
  },
  loader: {
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1f2937", // dark:bg-gray-900 equivalent
  },
  flatListContent: {
    gap: 3,
    maxWidth: 512,
    width: "100%",
  },
});
