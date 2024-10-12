// RanKing3Screen.js
import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { getTopPostImages } from "./fetchTopPosts";

const RangKing3Screen = () => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const topPosts = await getTopPostImages();
      setPost(topPosts[2]);
    };
    fetchPost();
  }, []);

  if (!post) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: post.imageUri }} style={styles.image} />
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.likes}>Likes: {post.likes.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  likes: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});

export default RangKing3Screen;
