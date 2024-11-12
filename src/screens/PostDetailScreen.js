// PostDetailScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Alert,
} from "react-native";
import {
  getLikesCount,
  toggleLikePost,
  addComment,
  getComments,
  getLikesData,
  deletePost,
} from "../firebase/firestoreService";
import { getAuth } from "firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";

const PostDetailScreen = ({ route, navigation }) => {
  const {
    title,
    content,
    postId,
    imageUrls = [],
    isDogPost = false, // 추가: isDogPost 플래그
    isCatPost = false, // 추가: isCatPost 플래그
  } = route.params;
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  // 파라미터 확인을 위한 로그 추가
  useEffect(() => {
    console.log("PostDetailScreen received params:", {
      postId,
      isDogPost,
      isCatPost,
    });
  }, []);

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        const likesCount = await getLikesCount(postId, isDogPost, isCatPost);
        setLikes(likesCount);

        const postLikes = await getLikesData(postId, isDogPost, isCatPost);
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          setLiked(postLikes.includes(user.uid));
          setIsOwner(user.uid === route.params.uid);
        }

        const commentsList = await getComments(postId, isDogPost, isCatPost);
        setComments(commentsList);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    fetchLikesAndComments();
  }, [postId]);

  const handleLikeToggle = async () => {
    try {
      const newLikedState = await toggleLikePost(postId, isDogPost, isCatPost);
      setLiked(newLikedState);
      setLikes((prevLikes) => (newLikedState ? prevLikes + 1 : prevLikes - 1));
    } catch (error) {
      console.error("좋아요 토글 오류:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      if (comment.trim()) {
        await addComment(postId, comment, isDogPost, isCatPost);
        setComment("");
        const commentsList = await getComments(postId, isDogPost, isCatPost);
        setComments(commentsList);
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId, isDogPost, isCatPost);
      Alert.alert("삭제 완료", "게시물이 삭제되었습니다.");
      navigation.goBack(); // 삭제 후 이전 화면으로 돌아가기
    } catch (error) {
      Alert.alert("삭제 오류", "게시물 삭제 중 문제가 발생했습니다.");
      console.error("게시물 삭제 오류:", error);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentUser}>{item.user_name}</Text>
      <Text>{item.commentText}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => index.toString()}
        style={styles.commentList}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            {/* 제목 섹션 */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {isOwner && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeletePost}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>

            {/* 내용 섹션 */}
            <View style={styles.contentContainer}>
              <Text style={styles.content}>{content}</Text>

              {/* 이미지가 있을 때 내용 섹션에만 이미지 추가 표시 */}
              {imageUrls.length > 0 && (
                <View style={styles.imageContentContainer}>
                  {imageUrls.map((url, index) => (
                    <Image
                      key={index}
                      source={{ uri: url }}
                      style={styles.contentImage}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              )}
            </View>

            {/* 좋아요 및 댓글 섹션 */}
            <View style={styles.interactionContainer}>
              <View style={styles.likeSection}>
                <TouchableOpacity
                  onPress={handleLikeToggle}
                  style={styles.likeButton}
                >
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={30}
                    color={liked ? "red" : "black"}
                  />
                  <Text style={styles.likeCount}>
                    {likes}명이 좋아요를 눌렀습니다
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 댓글 입력 섹션 */}
              <View style={styles.commentSection}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="댓글을 입력하세요..."
                  value={comment}
                  onChangeText={setComment}
                />
                <Button title="댓글 달기" onPress={handleCommentSubmit} />
              </View>
            </View>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F4EC" },
  titleContainer: {
    backgroundColor: "#F8F4EC",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  deleteButton: { padding: 5 },
  contentContainer: {
    backgroundColor: "#F8F4EC",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  content: { fontSize: 16, textAlign: "left", marginBottom: 10 },
  imageContentContainer: { marginTop: 15, alignItems: "center" },
  contentImage: { width: 300, height: 300, marginBottom: 15, borderRadius: 10 },
  interactionContainer: {
    backgroundColor: "#F8F4EC",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  likeSection: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  likeButton: { flexDirection: "row", alignItems: "center" },
  likeCount: { fontSize: 14, marginLeft: 5 },
  commentSection: { flexDirection: "row", alignItems: "center" },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
  },
  commentList: { marginTop: 20 },
  comment: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  commentUser: { fontWeight: "bold" },
});

export default PostDetailScreen;
