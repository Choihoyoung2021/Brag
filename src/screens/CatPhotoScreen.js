import React, { useState } from "react";
import { View, TextInput, StyleSheet, ScrollView, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the Icon

const CatPhotoScreen = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
    // Implement search logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChangeText={handleSearch}
        />
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
      </View>

      <ScrollView style={styles.postsContainer}>
        {/* Example content */}
        <Text style={styles.postText}>포스트 1</Text>
        <Text style={styles.postText}>포스트 2</Text>
        <Text style={styles.postText}>포스트 3</Text>
        {/* Add more posts here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    padding: 10,
  },
  postsContainer: {
    flex: 1,
    width: "100%", // Ensure ScrollView takes full width
    marginTop: 10, // Add some margin on top of the ScrollView
  },
  postText: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default CatPhotoScreen;
