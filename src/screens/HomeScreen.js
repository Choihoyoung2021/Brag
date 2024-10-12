import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTopPostImages } from "../firebase/fetchTopPosts";

const HomeScreen = ({ navigation }) => {
  const [isListVisible, setListVisible] = useState(false);
  const [topPosts, setTopPosts] = useState([]);

  const toggleListVisibility = () => {
    setListVisible(!isListVisible);
  };

  useEffect(() => {
    const fetchTopPosts = async () => {
      const posts = await getTopPostImages();
      setTopPosts(posts);
    };
    fetchTopPosts();
  }, []);

  const data = [
    { id: "1", title: "공지사항" },
    { id: "2", title: "자유게시판" },
    { id: "3", title: "강아지 게시판" },
    { id: "4", title: "고양이 게시판" },
    { id: "5", title: "나만의 사육TIP" },
    { id: "6", title: "캘린더" },
  ];

  const handlePress = (item) => {
    if (item.id === "1") {
      navigation.navigate("Announcement");
    } else if (item.id === "2") {
      navigation.navigate("FreePosts");
    } else if (item.id === "3") {
      navigation.navigate("DogPost");
    } else if (item.id === "4") {
      navigation.navigate("CatPost");
    } else if (item.id === "5") {
      navigation.navigate("TipPosts");
    } else if (item.id === "6") {
      navigation.navigate("Calender");
    } else {
      Alert.alert("선택된 항목", item.title);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* 로고만 중앙에 배치 */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/Logo2.png")} // 로고 경로
            style={styles.logoImage}
          />
        </View>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={toggleListVisibility}
        >
          <Ionicons name="list" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isListVisible && (
        <View style={styles.listContainer}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => handlePress(item)}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.contentContainer}>
        {/* 로컬 이미지 추가 */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/advertisement.png")}
            style={styles.image}
          />
        </View>

        {/* 이달의 반려동물 타이틀 섹션 */}
        <View style={styles.titleSection}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3163/3163689.png",
            }}
            style={styles.iconImage}
          />
          <Text style={styles.titleText}>반려동물 자랑하기</Text>
        </View>

        {/* 첫 번째 행: DogPhoto와 CatPhoto */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("DogPhoto")}
          >
            <Image
              source={{
                uri: "https://img.freepik.com/free-photo/cute-white-pomeranian-dog-on-a-chair_53876-138564.jpg",
              }}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CatPhoto")}
          >
            <Image
              source={{
                uri: "https://cdn.pointe.co.kr/news/photo/202106/3636_10174_4958.jpg",
              }}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>

        {/* 이달의 반려동물 타이틀 섹션 */}
        <View style={styles.titleSection}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/616/616490.png",
            }}
            style={styles.iconImage}
          />
          <Text style={styles.titleText}>이달의 반려동물</Text>
        </View>

        {/* 두 번째 행: RangKing1, RangKing2, RangKing3 */}
        <View style={styles.buttonRow}>
          {topPosts.map((post, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigation.navigate(`RangKing${index + 1}`)}
            >
              <Text style={styles.rankText}>{`${index + 1} 등`}</Text>
              {post.imageUri ? (
                <Image
                  source={{ uri: post.imageUri }}
                  style={styles.buttonImage}
                />
              ) : (
                <Text>No Image Available</Text> // 기본 텍스트 혹은 이미지
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 16,
    backgroundColor: "#F8F4EC", // 배경색
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center", // 로고를 중앙에 배치
    marginLeft: 40,
  },
  logoImage: {
    width: 100, // 원하는 크기 설정
    height: 100, // 원하는 크기 설정
    resizeMode: "contain", // 이미지가 비율에 맞게 표시되도록 설정
    // borderRadius 속성 제거
  },
  categoryButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    position: "absolute",
    top: 105,
    right: 35,
    width: "60%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 4,
    zIndex: 1,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
    height: 250,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    height: 200,
    backgroundColor: "#F8F4EC",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  rankText: {
    position: "absolute",
    top: -10,
    left: "50%",
    transform: [{ translateX: -15 }],
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    zIndex: 1,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  iconImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
