import React from "react";
import { Text, View, Image, StyleSheet, FlatList } from "react-native";

const profileData = {
  username: "username",
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
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>게시물</Text>
              <Text style={styles.statLabel}>10</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>팔로워</Text>
              <Text style={styles.statLabel}>100</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>팔로우</Text>
              <Text style={styles.statLabel}>200</Text>
            </View>
          </View>
          <Text style={styles.description}>{profileData.description}</Text>
        </View>
      </View>
      <FlatList
        data={profileData.posts}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()} // 인덱스를 사용하여 고유 키 생성
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.postsContainer, { marginTop: 130 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    paddingVertical: 90, // 상단에 추가적인 패딩
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
    width: 115,
    height: 115,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    marginTop: -10, // 사용자 이름을 프로필 사진 바로 오른쪽 상단으로 조정
  },
  username: {
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 20,
  },
  description: {
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8, // 통계 정보를 사용자 이름 아래로 약간의 여백을 두고 배치
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 16, // 통계 간 간격 조정
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
