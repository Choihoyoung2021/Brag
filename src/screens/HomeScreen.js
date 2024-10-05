import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [isListVisible, setListVisible] = useState(false);

  const toggleListVisibility = () => {
    setListVisible(!isListVisible);
  };

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
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요"
          />
          <TouchableOpacity style={styles.searchIconButton}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
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
            }} // 불 모양 아이콘의 URL을 사용
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
                uri: "https://img.freepik.com/free-photo/cute-white-pomeranian-dog-on-a-chair_53876-138564.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1722729600&semt=ais_hybrid",
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
            }} // 불 모양 아이콘의 URL을 사용
            style={styles.iconImage}
          />
          <Text style={styles.titleText}>이달의 반려동물</Text>
        </View>

        {/* 두 번째 행: RangKing1, RangKing2, RangKing3 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RangKing1")}
          >
            <Text style={styles.rankText}>1 등</Text>
            <Image
              source={{
                uri: "data:image/jpeg;base64,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",
              }}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RangKing2")}
          >
            <Text style={styles.rankText}>2 등</Text>
            <Image
              source={{
                uri: "data:image/jpeg;base64,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",
              }}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RangKing3")}
          >
            <Text style={styles.rankText}>3 등</Text>
            <Image
              source={{
                uri: "data:image/jpeg;base64,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",
              }}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    marginRight: 8,
  },
  searchIconButton: {
    padding: 8,
  },
  categoryButton: {
    marginLeft: 16,
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
    backgroundColor: "#ffffff",
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
    position: "absolute", // 절대 위치로 설정하여 이미지 위에 텍스트를 배치
    top: -10, // 이미지의 상단에서의 위치 (필요에 따라 조정)
    left: "50%", // 텍스트를 가로축 가운데 정렬
    transform: [{ translateX: -15 }], // 가로축 가운데로 이동 (텍스트 길이에 따라 조정)
    fontSize: 18, // 텍스트 크기 설정
    fontWeight: "bold", // 글자 굵기 설정
    color: "#000000", // 글자 색상 (필요에 따라 변경 가능)
    zIndex: 1, // 이미지보다 위에 오도록 설정
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
