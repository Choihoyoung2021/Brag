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
            placeholder="검색어를 입력하세요!"
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
      <ScrollView style={styles.contentContainer}>
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

        {/* 로컬 이미지 추가 */}
        <Image
          source={require("../../assets/logo2.png")} // 실제 이미지 경로로 변경
          style={styles.image}
        />
        {/* 추가적인 콘텐츠를 여기에 추가할 수 있습니다 */}
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
  },
  searchIconButton: {
    position: "absolute",
    right: 10,
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
    marginTop: 20,
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
  image: {
    width: "100%",
    height: 200,
    marginTop: 20,
    borderRadius: 8,
  },
  placeholderText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});

export default HomeScreen;
