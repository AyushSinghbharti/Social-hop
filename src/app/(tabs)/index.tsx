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
  const {user} = useAuth();
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
      .select("*, user: profiles(*)")
      // .eq("user_id", user?.id)
      .order('created_at', {ascending: false})
    if (error) {
      alert(error);
    }

    setPosts(data);
    isLoading(false);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size={40}
        className=" self-center color-blue-300 m-auto"
      />
    );
  }


  return (
    <FlatList
      data={posts}
      contentContainerStyle={{ gap: 3, maxWidth: 512, width: "100%" }}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
}
