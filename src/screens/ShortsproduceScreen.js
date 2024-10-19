// ShortsproduceScreen.js
import React from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ShortsproduceScreen = ({ navigation }) => {
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
        // 상세 설정 화면으로 네비게이션
        navigation.navigate("쇼츠", {
          screen: "ShortsDetailScreen",
          params: { videoUri: uri },
        });
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
