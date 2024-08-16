import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [isListVisible, setListVisible] = useState(false);

  const toggleListVisibility = () => {
    setListVisible(!isListVisible);
  };

  // 리스트 데이터 (예시)
  const data = [
    { id: "1", title: "공지사항" },
    { id: "2", title: "전체글보기" },
    { id: "3", title: "인기글" },
    { id: "4", title: "강아지/고양이게시판" },
    { id: "5", title: "나만의 사육TIP" },
    { id: "6", title: "캘린더" },
  ];

  // 리스트 항목 클릭 시 호출되는 함수
  const handlePress = (item) => {
    Alert.alert("선택된 항목", item.title);
    // 여기에 다른 동작을 추가할 수 있습니다 (예: 화면 전환 등)
  };

  return (
    <View style={styles.container}>
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
    justifyContent: "flex-start", // 상단에 배치
    alignItems: "center", // 수평 가운데 정렬
    paddingTop: 50, // 상단 여백
    paddingHorizontal: 16, // 좌우 여백
  },
  searchContainer: {
    flexDirection: "row", // 가로 방향 배치
    alignItems: "center", // 세로 방향 중앙 정렬
    width: "55%", // 전체 너비 사용
  },
  searchInput: {
    flex: 1, // 가용 공간을 모두 차지
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9", // 검색창 배경색
  },
  searchIconButton: {
    position: "absolute", // 검색 바 오른쪽에 아이콘을 배치
    right: 10,
    padding: 8,
  },
  categoryButton: {
    position: "absolute", // 카테고리 버튼을 화면 상단에 고정
    top: 50, // 상단 여백
    right: 16, // 우측 여백
    padding: 8, // 아이콘 주변 여백
  },
  listContainer: {
    position: "absolute", // 리스트 박스를 화면에 고정
    top: 100, // 카테고리 버튼 아래에 위치
    right: 16, // 우측 여백
    width: "60%", // 박스 너비
    backgroundColor: "#fff", // 배경색
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 4, // 그림자 효과
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default HomeScreen;
