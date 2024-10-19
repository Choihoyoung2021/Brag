import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore"; // Firestore에 추가하기 위한 import
import { storage, db } from "../firebase/FirebaseConfig"; // FirebaseConfig에서 storage와 db 가져오기
import { getAuth } from "firebase/auth"; // Firebase Authentication 가져오기

const ShortsproduceScreen = ({ navigation }) => {
  const auth = getAuth(); // auth 인스턴스 생성

  // Firestore에 비디오 URL을 저장하는 함수
  const saveVideoToFirestore = async (downloadURL) => {
    try {
      const user = auth.currentUser; // 현재 로그인한 사용자 정보 가져오기
      const userName = user.displayName || "익명"; // 닉네임이 없으면 '익명'으로 설정

      // Firestore의 videos 컬렉션에 비디오 정보 추가
      await addDoc(collection(db, "videos"), {
        videoUrl: downloadURL,
        uid: user.uid, // 사용자 uid 저장
        userName: userName, // 사용자 닉네임 저장
        createdAt: new Date(),
      });
      console.log("비디오 URL이 Firestore에 저장되었습니다:", downloadURL);
    } catch (error) {
      console.error("Firestore에 저장하는 중 오류 발생:", error);
      Alert.alert(
        "오류",
        "Firestore에 동영상 정보를 저장하는 중 문제가 발생했습니다."
      );
    }
  };

  // Firebase에 동영상 업로드 함수
  const uploadToFirebase = async (videoUri) => {
    try {
      const response = await fetch(videoUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `videos/${Date.now()}.mp4`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // 진행 상태를 모니터링할 수 있습니다.
          console.log(
            `Progress: ${
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            }%`
          );
        },
        (error) => {
          console.error("업로드 실패:", error);
          Alert.alert("오류", "동영상을 업로드하는 중 오류가 발생했습니다.");
        },
        () => {
          // 업로드 완료 시 다운로드 URL 가져오기
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("파일이 Firebase에 업로드되었습니다:", downloadURL);
            Alert.alert("성공", "동영상이 성공적으로 업로드되었습니다!");

            // Firestore에 저장하는 함수 호출
            saveVideoToFirestore(downloadURL);

            // 상세 화면 등으로 이동할 수 있습니다.
            navigation.navigate("쇼츠", {
              screen: "ShortsDetailScreen",
              params: { videoUri: downloadURL },
            });
          });
        }
      );
    } catch (error) {
      console.error("Firebase 업로드 중 오류 발생:", error);
      Alert.alert("오류", "Firebase에 업로드하는 중 오류가 발생했습니다.");
    }
  };

  // 동영상 촬영 함수
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true, // 편집 허용
        quality: 1, // 화질 최상
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log("촬영한 동영상 URI:", uri);

        // Firebase에 동영상 업로드
        uploadToFirebase(uri);
      }
    } catch (error) {
      console.error("동영상 촬영 오류:", error);
      Alert.alert("오류", "동영상 촬영 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="동영상 촬영" onPress={pickVideo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F4EC",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});

export default ShortsproduceScreen;
