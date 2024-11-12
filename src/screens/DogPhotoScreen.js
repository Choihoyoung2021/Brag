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
import { getDogPosts } from "../firebase/firestoreService"; // DogPosts 함수 import

const DogPhotoScreen = ({ navigation }) => {
  const [dogPosts, setDogPosts] = useState([]); // 변수명을 명확하게 변경
  const [searchText, setSearchText] = useState("");

  // Dog 게시물 가져오기
  useEffect(() => {
    const fetchDogPosts = async () => {
      try {
        const posts = await getDogPosts(); // getDogPosts 함수 호출
        setDogPosts(posts);
      } catch (error) {
        console.error("Dog 게시물 목록 가져오기 오류:", error);
      }
    };

    fetchDogPosts();
  }, []);

  // 검색어 핸들러
  const handleSearch = (text) => {
    setSearchText(text);
  };

  // 글쓰기 버튼 핸들러
  const handleAddPost = () => {
    navigation.navigate("PhotoAddScreen", { isDogPost: true }); // DogPhotoScreen에서 작성된 게시물임을 전달
  };

  // 게시물 클릭 시 상세 화면으로 이동
  const handlePostPress = (post) => {
    navigation.navigate("PostDetail", {
      title: post.title,
      content: post.content,
      postId: post.id,
      imageUrls: post.imageUrls || [],
      uid: post.uid,
      isDogPost: true, // Dog 게시물임을 전달
      isCatPost: false, // Cat 게시물이 아님을 명시
    });
  };

  // 게시물 렌더링 함수
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
      {/* 검색 창 */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChangeText={handleSearch}
        />
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>

      {/* 게시물 리스트 */}
      <FlatList
        data={dogPosts.filter(
          (post) =>
            post.title.includes(searchText) || post.content.includes(searchText)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        style={styles.postsContainer}
      />

      {/* 글쓰기 버튼 */}
      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddPost}>
        <Text style={styles.buttonText}>포토 글쓰기</Text>
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

export default DogPhotoScreen;
