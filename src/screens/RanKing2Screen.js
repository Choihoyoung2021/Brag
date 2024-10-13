import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { db } from "../firebase/FirebaseConfig"; // Firebase 설정 가져오기
import { doc, getDoc } from "firebase/firestore";
import LottieView from "lottie-react-native"; // Lottie 애니메이션 추가

const RangKing2Screen = ({ route }) => {
  const { postId, collection } = route.params; // postId와 collection 정보 받아오기
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, collection, postId); // 해당 컬렉션에서 해당 게시물 가져오기
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        setPost(postSnap.data());
      }
    };
    fetchPost();
  }, [collection, postId]);

  if (!post) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* 폭죽 애니메이션 */}
      <LottieView
        source={require("../../assets/fireworks.json")} // Lottie JSON 파일 경로
        autoPlay
        loop={false} // 한 번만 재생
        style={styles.fireworks}
      />

      {/* 축하 문구 */}
      <Text style={styles.congratulationsText}>
        🎉 랭킹 2등, 축하합니다! 🎉
      </Text>

      {/* 중앙 이미지 */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: post.imageUrls[0] }} style={styles.image} />
      </View>

      {/* 제목 및 좋아요 수 */}
      <View style={styles.infoContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F4EC", // 배경색 추가
    paddingHorizontal: 20,
  },
  fireworks: {
    width: 400, // 폭죽 애니메이션 크기 설정
    height: 400, // 폭죽 애니메이션 크기 설정
    position: "absolute", // 화면의 다른 요소 위에 겹치도록 설정
    top: -100, // 적절한 위치로 배치 (조정 가능)
  },
  congratulationsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff9900", // 주황색 텍스트로 강조
    marginBottom: 20, // 텍스트와 이미지 사이 여백
    textAlign: "center",
  },
  imageContainer: {
    width: 320,
    height: 320,
    borderRadius: 160, // 원형 테두리
    borderWidth: 5,
    borderColor: "#ffd700", // 금색 테두리 (축하 의미)
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    marginTop: 20, // 이미지와 제목 및 좋아요 수 사이의 여백
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default RangKing2Screen;
