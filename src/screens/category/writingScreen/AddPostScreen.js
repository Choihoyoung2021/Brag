import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { addPost } from "../../../firebase/firestoreService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/FirebaseConfig";

const AddPostScreen = ({ navigation, route }) => {
  const category = route.params?.category || "free";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "권한 부족",
          "이미지 업로드를 위해 갤러리 접근 권한이 필요합니다."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const resizedUri = await resizeImage(result.assets[0].uri);
        setImages([...images, resizedUri]);
      }
    } catch (error) {
      console.error("이미지 선택 오류:", error);
      Alert.alert("오류", "이미지 선택 중 오류가 발생했습니다.");
    }
  };

  const resizeImage = async (uri) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return resizedImage.uri;
    } catch (error) {
      console.error("이미지 크기 조정 오류:", error);
      return uri;
    }
  };

  const uploadImageAsync = async (uri) => {
    try {
      const blob = await getBlob(uri);
      const fileName = `${Date.now()}-${uri.split("/").pop()}`;
      const storageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(storageRef, blob);
      blob.close();
      const downloadUrl = await getDownloadURL(storageRef);
      return { fileName, downloadUrl };
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      Alert.alert("오류", "이미지 업로드 중 문제가 발생했습니다.");
      return null;
    }
  };

  const getBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const handleSave = async () => {
    if (title === "" || content === "") {
      Alert.alert("오류", "제목과 내용을 입력해 주세요.");
      return;
    }

    setUploading(true);

    try {
      const imageUploadResults = await Promise.all(
        images.map((image) => uploadImageAsync(image))
      );
      const filteredResults = imageUploadResults.filter(
        (result) => result !== null
      );
      const imageNames = filteredResults.map((result) => result.fileName);
      const imageUrls = filteredResults.map((result) => result.downloadUrl);
      await addPost(title, content, category, imageUrls, imageNames);
      Alert.alert("성공", "글 작성이 완료되었습니다.");
      navigation.goBack();
    } catch (error) {
      console.error("글 작성 오류:", error);
      Alert.alert("오류", "글 작성 중 문제가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
      />
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.textArea}
        value={content}
        onChangeText={setContent}
        placeholder="내용을 입력하세요"
        multiline
      />
      <Text style={styles.label}>이미지 업로드</Text>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
        {images.length < 3 && (
          <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
            <Text style={styles.imageText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleSave}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "업로드 중..." : "저장"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70, // 상단 패딩을 추가하여 화면을 아래로 내림
    paddingHorizontal: 20,
    backgroundColor: "#F8F4EC",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20, // 라벨 상단 여백 추가
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 30, // 아래 여백 추가
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  textArea: {
    height: 120,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 30, // 아래 여백 추가
    padding: 15,
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30, // 아래 여백 추가
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  imageText: {
    fontSize: 40,
    color: "#ccc",
  },
  buttonContainer: {
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80, // 아래 여백 추가
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default AddPostScreen;
