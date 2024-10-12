// FreePosts.js
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
import { getFreePosts } from "../../firebase/firestoreService"; // Firestore에서 게시물 데이터를 가져오는 함수 import

const FreePosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Firestore에서 게시물 데이터를 가져오는 함수
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
    navigation.navigate("AddPost"); // 글쓰기 화면으로 이동
  };

  const handlePostPress = (post) => {
    // 선택된 게시물의 데이터를 상세 보기 화면으로 전달
    navigation.navigate("PostDetail", {
      title: post.title,
      content: post.content,
      postId: post.id, // 게시물 ID를 사용하여 댓글 등을 가져옴
      imageUrls: post.imageUrls || [], // 게시물의 imageUrls 배열을 전달 (빈 배열 처리 추가)
      uid: post.uid,
    });
  };

  // 게시물 목록 화면의 각 항목을 렌더링하는 함수
  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.post} onPress={() => handlePostPress(item)}>
      <View style={styles.postHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.userName}>작성자: {item.user_name}</Text>
      </View>

      {/* 게시물 내용 표시 (간단하게 한 줄로 표시) */}
      <Text
        style={styles.content}
        numberOfLines={1} // 한 줄로 고정
        ellipsizeMode="tail" // 말줄임표(...) 추가
      >
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
        renderItem={renderPost} // renderItem 함수에서 handlePostPress를 사용하여 게시물 클릭 시 이동 처리
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
    color: "#333", // 글씨 색깔
    fontSize: 14, // 글씨 크기
    marginTop: 5, // 제목과 내용 사이 간격을 1줄(5px)로 띄움
  },
  thumbnailImage: {
    width: 80, // 썸네일 이미지 너비 축소
    height: 80, // 썸네일 이미지 높이 축소
    borderRadius: 10,
    marginTop: 10,
  },
});

export default FreePosts;
