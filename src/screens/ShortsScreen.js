// ShortsScreen.js

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Video } from "expo-av";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig"; // Firebase 설정 가져오기

const { width, height } = Dimensions.get("window");

const ShortsScreen = () => {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

  // Firebase에서 쇼츠 데이터 가져오기
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const shortsCollection = await getDocs(collection(db, "shorts_posts")); // 저장된 videos 컬렉션에서 데이터 가져오기
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
        source={{ uri: item.videoUrl }} // Firebase에서 가져온 비디오 URL
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={currentIndex === index} // 현재 화면에 보이는 비디오만 재생
        isLooping
        style={styles.video}
        onError={(error) => console.log("비디오 로드 오류:", error)}
      />
    </View>
  );

  useEffect(() => {
    // 이전 비디오를 일시 정지하고 현재 비디오를 재생
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.playAsync();
        } else {
          video.pauseAsync();
        }
      }
    });
  }, [currentIndex]);

  if (!shorts.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <FlatList
      data={shorts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled // 페이지별 스크롤
      vertical // 세로 스크롤
      showsVerticalScrollIndicator={false} // 스크롤 인디케이터 숨기기
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewConfigRef}
      windowSize={2}
      initialNumToRender={1} // 초기 렌더링할 항목 수
      maxToRenderPerBatch={1} // 한 번에 렌더링할 항목 수
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  item: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: height,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShortsScreen;
