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
} from "react-native";
import { addComment, getComments } from "../firebase/firestoreService";

const PostDetailScreen = ({ route }) => {
  const { title, content, postId } = route.params;
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments.map((c) => c.comment));
    };
    fetchComments();
  }, [postId]);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      await addComment(postId, comment);
      setComments([...comments, comment]);
      setComment("");
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text>{item}</Text>
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
            {/* 제목 박스 */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* 내용 박스 */}
            <View style={styles.contentContainer}>
              <Text style={styles.content}>{content}</Text>
            </View>

            {/* 좋아요 및 댓글 인터랙션 박스 */}
            <View style={styles.interactionContainer}>
              <View style={styles.likeSection}>
                <Button title={`좋아요 (${likes})`} onPress={handleLike} />
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
    backgroundColor: "#ffffff", // 전체 배경색을 하얀색으로 설정
  },
  titleContainer: {
    backgroundColor: "#ffffff", // 배경색
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3, // 테두리 추가
    borderColor: "#ddd", // 테두리 색상
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  contentContainer: {
    backgroundColor: "#ffffff", // 내용 부분 배경색
    padding: 15, // 패딩 조정
    borderRadius: 8,
    marginBottom: 20,
    height: 200,
    borderWidth: 3, // 테두리 추가
    borderColor: "#ddd", // 테두리 색상
  },
  content: {
    fontSize: 16,
    textAlign: "left", // 텍스트 정렬 설정
  },
  interactionContainer: {
    backgroundColor: "#ffffff", // 인터랙션 부분 배경색
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 3, // 테두리 추가
    borderColor: "#ddd", // 테두리 색상
  },
  likeSection: {
    marginBottom: 10,
    marginRight: "78%",
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
});

export default PostDetailScreen;
