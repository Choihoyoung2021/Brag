// AddPostScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addPost } from "../../../firebase/firestoreService";

const AddPostScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    if (title === "" || content === "") {
      Alert.alert("오류", "제목과 내용을 입력해 주세요.");
      return;
    }

    try {
      await addPost(title, content);
      navigation.navigate("AllPosts"); // 글쓰기 완료 후 AllPosts 화면으로 이동
    } catch (error) {
      Alert.alert("오류", "글 작성 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="저장" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default AddPostScreen;
