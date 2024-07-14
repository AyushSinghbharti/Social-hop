import { Image, StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import PostListItem from "~/src/components/PostListItem";
import posts from "~/assets/data/posts.json";

const index = () => {
  return (
    <FlatList
      data={posts}
      contentContainerStyle={{ gap: 3}}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
};

export default index;
