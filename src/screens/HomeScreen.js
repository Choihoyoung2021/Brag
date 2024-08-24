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

const HomeScreen = () => {
  const [isListVisible, setListVisible] = useState(false);

  const toggleListVisibility = () => {
    setListVisible(!isListVisible);
  };

  const data = [
    { id: "1", title: "공지사항" },
    { id: "2", title: "전체글보기" },
    { id: "3", title: "인기글" },
    { id: "4", title: "강아지/고양이게시판" },
    { id: "5", title: "나만의 사육TIP" },
    { id: "6", title: "캘린더" },
  ];

  const handlePress = (item) => {
    Alert.alert("선택된 항목", item.title);
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
            source={require("../../assets/advertisement.png")} // 실제 이미지 경로로 변경
            style={styles.image}
          />
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
    backgroundColor: "#FFFFFF", // 배경색 설정
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
    marginRight: 8, // 아이콘과의 간격
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
    top: 105, // 헤더 높이에 따라 조정 필요
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
    overflow: "hidden", // 이미지가 영역을 넘지 않도록 설정
  },
  image: {
    width: "100%",
    height: "100%", // 컨테이너 크기에 맞게 조정
    resizeMode: "contain", // 이미지가 비율에 맞게 조정
  },
});

export default HomeScreen;
