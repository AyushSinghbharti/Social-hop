import { Image, StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import PostListItem from "~/src/components/PostListItem";
import posts from "~/assets/data/posts.json";

const index = () => {
  return (
    <FlatList
      data={posts}
      // className="items-center"
      contentContainerStyle={{ gap: 3, maxWidth: 512, width: '100%'}}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
};

export default index;
