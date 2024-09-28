import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const profileData = {
  username: "username",
  profileImage: "https://via.placeholder.com/80", // 프로필 사진
  posts: [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ],
};

const ProfilesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderPost = ({ item }) => (
    <Image source={{ uri: item }} style={styles.postImage} />
  );

  const handleSettingsPress = () => {
    setModalVisible(true);
  };

  const handleLogoutPress = () => {
    setModalVisible(false);
    console.log("로그아웃 버튼 클릭됨");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.profileLabel}>프로필</Text>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Ionicons
              name="settings-outline"
              size={24}
              color="black"
              style={styles.settingsIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
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
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.postsContainer, { marginTop: 130 }]}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleLogoutPress}>
                <Text style={styles.logoutText}>로그아웃</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingsIcon: {
    marginRight: 16,
  },
  profileInfo: {
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
    marginTop: -10,
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
    marginTop: 8,
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cancelText: {
    color: "#007bff",
    fontSize: 16,
  },
});

export default ProfilesScreen;
