import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
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
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => handlePress(item)}
              >
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
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
  },
  headerContainer: {
    flexDirection: "row", // 검색과 카테고리 버튼을 가로로 배치
    alignItems: "center",
    justifyContent: "space-between", // 검색창과 버튼 사이 공간을 균등하게 분배
    width: "100%", // 전체 너비 사용
    paddingHorizontal: 16, // 좌우 여백
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // 검색창이 가능한 큰 공간을 차지하도록 설정
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  searchIconButton: {
    position: "absolute",
    right: 10,
    padding: 8,
  },
  categoryButton: {
    marginLeft: 16, // 검색창과 버튼 사이의 간격
    padding: 8,
  },
  listContainer: {
    position: "absolute",
    top: 100,
    right: 16,
    width: "60%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 4,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default HomeScreen;
