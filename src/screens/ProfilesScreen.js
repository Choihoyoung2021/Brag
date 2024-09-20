import React from "react";
import { Text, View, Image, StyleSheet, FlatList } from "react-native";

const profileData = {
  username: "username",
  description: "This is a user description",
  profileImage: "https://via.placeholder.com/80", // 프로필 사진
  posts: [
    "https://via.placeholder.com/150", // 게시물 이미지 1
    "https://via.placeholder.com/150", // 게시물 이미지 2
    "https://via.placeholder.com/150", // 게시물 이미지 3
    "https://via.placeholder.com/150", // 게시물 이미지 4
    "https://via.placeholder.com/150", // 게시물 이미지 5
    "https://via.placeholder.com/150", // 게시물 이미지 6
  ],
};

const ProfilesScreen = () => {
  const renderPost = ({ item }) => (
    <Image source={{ uri: item }} style={styles.postImage} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.profileLabel}>프로필</Text>
      <View style={styles.header}>
        <Image
          source={{ uri: profileData.profileImage }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.description}>{profileData.description}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>게시물</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>100</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>200</Text>
            <Text style={styles.statLabel}>팔로우</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={profileData.posts}
        renderItem={renderPost}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    paddingTop: 40, // 상단에 추가적인 패딩
  },
  profileLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    marginTop: 8, // 사용자 이름을 프로필 사진 바로 오른쪽 상단으로 조정
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 8, // 통계 간 간격 조정
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statLabel: {
    color: "#666",
  },
  postImage: {
    width: "33%",
    aspectRatio: 1,
    margin: 1,
  },
  row: {
    justifyContent: "space-between",
  },
  postsContainer: {
    paddingBottom: 16,
  },
});

export default ProfilesScreen;
