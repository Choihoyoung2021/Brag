import React, { useState } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
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
    if (item.id === "1") {
      navigation.navigate("Announcement");
    } else if (item.id === "2") {
      navigation.navigate("AllPosts");
    } else if (item.id === "3") {
      navigation.navigate("PopularPosts");
    } else if (item.id === "4") {
      navigation.navigate("PetPost");
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
          <TextInput style={styles.searchInput} placeholder="검색어를 입력하세요" />
          <TouchableOpacity style={styles.searchIconButton}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.categoryButton} onPress={toggleListVisibility}>
          <Ionicons name="list" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isListVisible && (
        <View style={styles.listContainer}>
          {data.map((item) => (
            <TouchableOpacity key={item.id} style={styles.listItem} onPress={() => handlePress(item)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.contentContainer}>
        {/* 로컬 이미지 추가 */}
        <View style={styles.imageContainer}>
          <Image source={require("../../assets/advertisement.png")} style={styles.image} />
        </View>

        {/* 둥근 모서리 사각형 버튼 두 개 가로로 나란히 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("DogPost")}>
            <Image
              source={{
                uri: "https://img.freepik.com/free-photo/cute-white-pomeranian-dog-on-a-chair_53876-138564.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1722729600&semt=ais_hybrid",
              }}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CatPost")}>
            <Image
              source={{
                uri: "https://cdn.pointe.co.kr/news/photo/202106/3636_10174_4958.jpg",
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
});

export default HomeScreen;
