import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Video } from "expo-av";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import {
  toggleLikePost,
  getLikesCount,
  addComment,
  getComments,
} from "../firebase/firestoreService";

const { width, height } = Dimensions.get("window");

const ShortsScreen = () => {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 텍스트 상태
  const [selectedShortId, setSelectedShortId] = useState(null); // 선택한 쇼츠 ID
  const videoRefs = useRef([]);

  // Firebase에서 쇼츠 데이터 가져오기
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const shortsCollection = await getDocs(collection(db, "shorts_posts"));
        const shortsList = shortsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShorts(shortsList);

        // 각 쇼츠의 좋아요 수 가져오기
        const likesData = {};
        const commentsData = {};
        for (const short of shortsList) {
          const count = await getLikesCount(short.id, false, false, true);
          const shortComments = await getComments(short.id, false, false, true);
          likesData[short.id] = count;
          commentsData[short.id] = shortComments;
        }
        setLikes(likesData);
        setComments(commentsData);
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

  // 좋아요 토글 함수
  const handleLike = async (shortId) => {
    try {
      const newLikeStatus = await toggleLikePost(shortId, false, false, true);
      const updatedLikes = await getLikesCount(shortId, false, false, true);
      setLikes((prevLikes) => ({
        ...prevLikes,
        [shortId]: updatedLikes,
      }));
    } catch (error) {
      console.error("좋아요 오류:", error);
    }
  };

  // 댓글 추가 함수
  const handleAddComment = async () => {
    if (newComment.trim() === "") return; // 빈 댓글 처리

    try {
      await addComment(selectedShortId, newComment, false, false, true);
      const updatedComments = await getComments(
        selectedShortId,
        false,
        false,
        true
      );
      setComments((prevComments) => ({
        ...prevComments,
        [selectedShortId]: updatedComments,
      }));
      setNewComment(""); // 댓글 추가 후 입력창 비우기
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  // 댓글 모달을 열 때 쇼츠 ID 저장
  const openCommentModal = (shortId) => {
    setSelectedShortId(shortId);
    setIsModalVisible(true);
  };

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
        onError={(error) => console.log("비디오 로드 오류:", error)}
      />
      {/* 좋아요 및 댓글 UI */}
      <View style={styles.interactionContainer}>
        <TouchableOpacity
          onPress={() => handleLike(item.id)}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>❤️ {likes[item.id] || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openCommentModal(item.id)} // 댓글 아이콘 클릭 시 모달 열림
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>
            💬 {comments[item.id]?.length || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
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
    <>
      <FlatList
        data={shorts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        vertical
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
        windowSize={2}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        removeClippedSubviews
      />

      {/* 댓글 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>댓글</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* 댓글 리스트 */}
            <FlatList
              data={comments[selectedShortId]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentText}>
                    {item.user_name}: {item.commentText}
                  </Text>
                </View>
              )}
            />

            {/* 댓글 입력 */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="댓글 추가..."
                value={newComment}
                onChangeText={(text) => setNewComment(text)}
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Text style={{ color: "blue" }}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
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
  interactionContainer: {
    position: "absolute",
    right: 20,
    bottom: 100,
    flexDirection: "column",
    alignItems: "center",
  },
  iconButton: {
    marginVertical: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  iconText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "80%", // 모달이 화면의 80%까지 올라오도록 설정
    backgroundColor: "#F8F4EC",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  commentText: {
    fontSize: 16,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

export default ShortsScreen;
