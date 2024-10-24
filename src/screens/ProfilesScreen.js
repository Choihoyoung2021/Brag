import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth"; // Firebase Auth 및 signOut import
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore import
import { db } from "../firebase/FirebaseConfig"; // Firestore 설정
import { getFriendsList } from "../firebase/firestoreService"; // 친구 목록 가져오기 함수
import * as VideoThumbnails from "expo-video-thumbnails"; // 동영상 썸네일 생성

const ProfilesScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [thumbnails, setThumbnails] = useState({}); // 썸네일 저장 상태 추가
  const [selectedTab, setSelectedTab] = useState("posts");
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 관리

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login"); // 유저가 없으면 로그인 화면으로 이동
      return;
    }

    // 유저 데이터, 게시물, 쇼츠, 친구 목록 가져오기
    const fetchUserDataAndRelatedInfo = async () => {
      try {
        // 유저 데이터 가져오기
        const userDoc = await getDocs(
          query(collection(db, "users"), where("uid", "==", user.uid))
        );
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setUserData(userData);
        }

        // 게시물 가져오기
        const postsQuery = query(
          collection(db, "posts"),
          where("uid", "==", user.uid)
        );
        const postsSnapshot = await getDocs(postsQuery);
        setPosts(
          postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // 쇼츠 가져오기
        const shortsQuery = query(
          collection(db, "shorts_posts"),
          where("uid", "==", user.uid)
        );
        const shortsSnapshot = await getDocs(shortsQuery);
        const shortsData = shortsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShorts(shortsData);

        // 쇼츠 썸네일 생성
        const fetchThumbnails = async () => {
          const thumbnailsData = {};
          for (const short of shortsData) {
            const thumbnailUri = await generateThumbnail(short.videoUrl);
            thumbnailsData[short.id] = thumbnailUri;
          }
          setThumbnails(thumbnailsData); // 썸네일을 상태에 저장
        };
        fetchThumbnails();

        // 친구 목록 가져오기
        const friendsList = await getFriendsList(); // 친구 목록 가져오기
        setFriends(friendsList);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    fetchUserDataAndRelatedInfo();
  }, [user]);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    if (user) {
      signOut(auth)
        .then(() => {
          console.log("로그아웃 성공");
          setModalVisible(false);
          navigation.navigate("Login"); // 로그인 화면으로 이동
        })
        .catch((error) => {
          console.error("로그아웃 오류:", error);
          Alert.alert("로그아웃 오류", "로그아웃에 실패했습니다.");
        });
    } else {
      console.error("로그아웃 오류: 유저가 없습니다.");
      Alert.alert("로그아웃 오류", "로그인된 사용자가 없습니다.");
    }
  };

  // 쇼츠의 첫 장면을 썸네일로 만드는 함수
  const generateThumbnail = async (videoUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 1000, // 1초 시점의 썸네일 생성
      });
      return uri;
    } catch (error) {
      console.warn("썸네일 생성 오류:", error);
      return null;
    }
  };

  // 게시물 렌더링 함수
  const renderPost = ({ item }) => {
    const imageUrl =
      item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null;

    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() =>
          navigation.navigate("PostDetail", {
            postId: item.id,
            title: item.title,
            content: item.content,
            imageUrls: item.imageUrls,
          })
        }
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.postImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>{item.title}</Text>
            <Text style={styles.placeholderContent}>
              {item.content.length > 30
                ? item.content.substring(0, 30) + "..."
                : item.content}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // 쇼츠 렌더링 함수
  const renderShorts = ({ item }) => {
    const thumbnailUri = thumbnails[item.id]; // 저장된 썸네일 사용

    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() =>
          navigation.navigate("ShortsPlayer", {
            videoUrl: item.videoUrl, // 해당 쇼츠의 URL 전달
          })
        }
      >
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.postImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>로딩 중...</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <Image
            source={{
              uri: userData?.profileImage || "https://via.placeholder.com/80",
            }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {userData?.user_name || "username"}
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>게시물</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{shorts.length}</Text>
                <Text style={styles.statLabel}>쇼츠</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{friends.length}</Text>
                <Text style={styles.statLabel}>친구</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)} // 톱니바퀴 클릭 시 모달 열기
          >
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* 게시물/쇼츠 선택 탭 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "posts" && styles.selectedTab]}
            onPress={() => setSelectedTab("posts")}
          >
            <Text
              style={
                selectedTab === "posts"
                  ? styles.selectedTabText
                  : styles.tabText
              }
            >
              게시물
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "shorts" && styles.selectedTab]}
            onPress={() => setSelectedTab("shorts")}
          >
            <Text
              style={
                selectedTab === "shorts"
                  ? styles.selectedTabText
                  : styles.tabText
              }
            >
              쇼츠
            </Text>
          </TouchableOpacity>
        </View>

        {/* 선택된 탭에 따라 게시물/쇼츠 렌더링 */}
        <FlatList
          data={selectedTab === "posts" ? posts : shorts}
          renderItem={selectedTab === "posts" ? renderPost : renderShorts}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3} // 3열로 정렬
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 10,
          }}
          contentContainerStyle={{
            paddingLeft: 5, // 왼쪽 여백을 줘서 정렬 문제 해결
          }}
        />

        {/* 로그아웃 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logoutText}>로그아웃</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F4EC",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F4EC",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statLabel: {
    color: "#666",
  },
  postContainer: {
    width: 110,
    height: 110,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f2f2f2",
  },
  placeholderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  placeholderContent: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingVertical: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  selectedTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  settingsButton: {
    alignSelf: "flex-start",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cancelText: {
    color: "#007bff",
    fontSize: 16,
  },
});

export default ProfilesScreen;
