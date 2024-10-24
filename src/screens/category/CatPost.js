import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image, // Image 컴포넌트 추가
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getPostsByCategory } from "../../firebase/firestoreService"; // 수정된 getPostsByCategory 함수 사용

const DogPost = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const categoryPosts = await getPostsByCategory("cat"); // "dog" 카테고리의 글만 가져옴
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
    navigation.navigate("AddPost", { category: "cat" }); // 글쓰기 화면으로 이동 시 "dog" 카테고리 정보 전달
  };

  const handlePostPress = (post) => {
    navigation.navigate("PostDetail", {
      title: post.title,
      content: post.content,
      postId: post.id,
      category: "cat",
      imageUrls: post.imageUrls || [], // 이미지 URL 배열 전달
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
      {/* 이미지 썸네일 추가 (첫 번째 이미지만 표시) */}
      {item.imageUrls && item.imageUrls.length > 0 && (
        <Image
          source={{ uri: item.imageUrls[0] }} // 첫 번째 이미지의 URL 사용
          style={styles.thumbnailImage} // 스타일 적용
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
    backgroundColor: "#F8F4EC",
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
    color: "#333",
    fontSize: 14,
    marginTop: 5,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default DogPost;
