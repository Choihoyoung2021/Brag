import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getPostsByCategory } from "../../firebase/firestoreService";

const TipPost = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryPosts = await getPostsByCategory("tip");
        setPosts(categoryPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleAddPost = () => {
    navigation.navigate("AddPost", { category: "tip" });
  };

  const handlePostPress = (post) => {
    navigation.navigate("PostDetail", {
      title: post.title,
      content: post.content,
      postId: post.id,
      category: "tip",
      imageUrls: post.imageUrls || [],
      uid: post.uid,
    });
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.post} onPress={() => handlePostPress(item)}>
      <View style={styles.postHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.userName}>작성자: {item.user_name}</Text>
      </View>
      <Text style={styles.content} numberOfLines={1} ellipsizeMode="tail">
        {item.content}
      </Text>
      {item.imageUrls && item.imageUrls.length > 0 && (
        <Image
          source={{ uri: item.imageUrls[0] }}
          style={styles.thumbnailImage}
        />
      )}
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
        contentContainerStyle={{ paddingBottom: 100 }}
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
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "#F8F4EC",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    alignSelf: "center",
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
    marginTop: 20,
  },
  post: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
  },
  userName: {
    fontStyle: "italic",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 50,
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
    width: 100,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default TipPost;
