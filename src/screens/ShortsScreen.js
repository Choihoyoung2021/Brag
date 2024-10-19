// ShortsScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { db } from "../firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Video } from "expo-av"; // Expo Video 컴포넌트 사용

const { width, height } = Dimensions.get("window");

const ShortsScreen = ({ navigation }) => {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const shortsCollection = await getDocs(collection(db, "shorts_posts")); // "shorts_posts" 컬렉션 참조
        const shortsList = shortsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShorts(shortsList);
      } catch (error) {
        console.error("쇼츠 불러오기 오류:", error);
      }
    };
    fetchShorts();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }).current;

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Video
        ref={(ref) => (videoRefs.current[index] = ref)}
        source={{ uri: item.videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={currentIndex === index}
        isLooping
        style={styles.video}
      />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  useEffect(() => {
    // 이전 비디오 일시정지
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pauseAsync();
      } else if (video && index === currentIndex) {
        video.playAsync();
      }
    });
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        data={shorts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled // 페이지별 스크롤
        vertical // 세로 스크롤
        showsVerticalScrollIndicator={false} // 스크롤 인디케이터 숨기기
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // 배경을 검은색으로 변경
  },
  item: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: height * 0.8, // 화면의 80% 높이
  },
  title: {
    color: "#fff",
    position: "absolute",
    bottom: 50,
    left: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ShortsScreen;
