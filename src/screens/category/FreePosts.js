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
import Icon from "react-native-vector-icons/FontAwesome";
import { getAllPosts } from "../../firebase/firestoreService";

const AllPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
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
    navigation.navigate("AddPost"); // 글쓰기 화면으로 이동
  };

  const handlePostPress = (post) => {
    // 선택된 게시물의 데이터를 상세 보기 화면으로 전달
    navigation.navigate("PostDetail", {
      title: post.title,
      content: post.content,
      postId: post.id, // 게시물 ID를 사용하여 댓글 등을 가져옴
    });
  };

  // AllPosts.js의 renderPost 함수 수정
  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.post} onPress={() => handlePostPress(item)}>
      <View style={styles.postHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.userName}>작성자: {item.user_name}</Text>
      </View>
      {/* 수정된 내용 */}
      <Text
        style={styles.content}
        numberOfLines={1} // 한 줄로 고정
        ellipsizeMode="tail" // 말줄임표(...) 추가
      >
        {item.content}
      </Text>
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
  content: {
    color: "#333", // 글씨 색깔
    fontSize: 14, // 글씨 크기
    marginTop: -5, // 간격
  },
});

export default AllPosts;
