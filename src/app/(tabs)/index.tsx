import { Image, StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import PostListItem from "~/src/components/PostListItem";
import Post from "~/assets/data/interface";
import { supabase } from "~/src/lib/supabase";

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    isLoading(true);
    let { data, error } = await supabase.from("posts").select("*, user: profiles(*)");
    if(error){
      alert(error);
    }

    setPosts(data);
    isLoading(false);
  };

  if(loading){
    return <ActivityIndicator size={40} className=" self-center color-blue-300 m-auto" />
  }

  return (
    <FlatList
      data={posts}
      // className="items-center"
      contentContainerStyle={{ gap: 3, maxWidth: 512, width: "100%" }}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
}
