import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import {
  getLikesCount,
  toggleLikePost,
  addComment,
  getComments,
  getLikesData,
} from "../firebase/firestoreService";
import { getAuth } from "firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";

const PostDetailScreen = ({ route }) => {
  const { title, content, postId, userName } = route.params;
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const commentsList = await getComments(postId);
      setComments(commentsList);
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        const likesCount = await getLikesCount(postId);
        setLikes(likesCount);

        const postLikes = await getLikesData(postId);
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          setLiked(postLikes.includes(user.uid));
        }

        await fetchComments();
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    fetchLikesAndComments().catch((error) =>
      console.error("좋아요 및 댓글 가져오기 오류:", error)
    );
  }, [postId]);

  const handleLikeToggle = async () => {
    try {
      const newLikedState = await toggleLikePost(postId);
      setLiked(newLikedState);
      setLikes((prevLikes) => (newLikedState ? prevLikes + 1 : prevLikes - 1));
    } catch (error) {
      console.error("좋아요 토글 오류:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      if (comment.trim()) {
        await addComment(postId, comment);
        setComment("");
        await fetchComments();
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error);
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
        ListHeaderComponent={
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* 내용 부분을 ScrollView 대신 View로 감싸고, 높이 제한 제거 */}
            <View style={styles.contentContainer}>
              <Text style={styles.content}>{content}</Text>
            </View>

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
          </>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  titleContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  content: {
    fontSize: 16,
    textAlign: "left",
  },
  interactionContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  likeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    fontSize: 14,
    marginLeft: 5,
  },
  commentSection: {
    height: 50,
    flexDirection: "row",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
  },
  commentList: {
    marginTop: 20,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default PostDetailScreen;
