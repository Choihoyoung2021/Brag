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
import { getFreePosts } from "../../firebase/firestoreService";

const FreePosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const freePosts = await getFreePosts();
        setPosts(freePosts);
      } catch (error) {
        console.error("게시물 목록 가져오기 오류:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleAddPost = () => {
    navigation.navigate("AddPost");
  };

  const handlePostPress = (post) => {
    navigation.navigate("PostDetail", {
      title: post.title,
      content: post.content,
      postId: post.id,
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
      {/* 검색바 컨테이너 */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChangeText={handleSearch}
        />
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>

      {/* 게시물 목록 */}
      <FlatList
        data={posts.filter(
          (post) =>
            post.title.includes(searchText) || post.content.includes(searchText)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        style={styles.postsContainer}
        contentContainerStyle={{ paddingBottom: 100 }} // 목록의 아래쪽 여백 추가
      />

      {/* 글쓰기 버튼 */}
      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddPost}>
        <Text style={styles.buttonText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // 전체 화면 아래로 내리기
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
    marginBottom: 20, // 검색바 아래 여백 추가
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
    width: "100%",
    marginTop: 20, // 목록 전체를 아래로 내리기
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
    fontSize: 16,
  },
  userName: {
    fontStyle: "italic",
    fontSize: 14,
    color: "#666",
  },
  content: {
    color: "#333",
    fontSize: 14,
    marginTop: 10,
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
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
});

export default FreePosts;
