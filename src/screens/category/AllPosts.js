// AllPosts.js
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the Icon

import { getAllPosts } from "../../firebase/firestoreService";

const AllPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch all posts when the component mounts
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    };

    fetchPosts();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleAddPost = () => {
    navigation.navigate("AddPost"); // Navigate to AddPostScreen
  };

  const handlePostPress = (post) => {
    // Navigate to PostDetailScreen with the selected post's data
    navigation.navigate("PostDetail", {
      title: post.title,
      content: post.content,
      postId: post.id, // Assuming the post ID is used to fetch comments
    });
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.post} onPress={() => handlePostPress(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChangeText={handleSearch}
        />
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>

      <FlatList
        data={posts.filter(
          (post) =>
            post.title.includes(searchText) || post.content.includes(searchText)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        style={styles.postsContainer}
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddPost}>
        <Text style={styles.buttonText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    padding: 10,
  },
  postsContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
  },
  post: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "flex-end",
    marginBottom: 80,
    marginRight: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
    width: 120,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AllPosts;
