import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import AddFriendModal from "./AddFriendScreen"; // 새로 만든 모달 추가

const ChattingRoomScreen = ({ navigation }) => {
  const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);

  const chatRooms = [
    {
      id: "1",
      name: "Shane Martinez",
      message: "On my way home but I needed to stop by the book store to...",
      time: "5 min",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      unreadCount: 1,
    },
    {
      id: "2",
      name: "Katie Keller",
      message: "I'm watching Friends. What are you doing?",
      time: "15 min",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "Stephen Mann",
      message: "I'm working now. I'm making a deposit for our company.",
      time: "1 hour",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      unreadCount: 0,
    },
    {
      id: "4",
      name: "Shane Martinez",
      message:
        "I really find the subject very interesting. I'm enjoying all my...",
      time: "5 hours",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      unreadCount: 0,
    },
  ];

  const handleRoomSelect = (roomId) => {
    navigation.navigate("ChattingScreen", { roomId });
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomContainer}
      onPress={() => handleRoomSelect(item.id)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단의 친구추가 및 친구검색 버튼 */}
      <View style={styles.header}>
        <Button
          title="친구목록"
          onPress={() => navigation.navigate("FriendListScreen")}
        />
        <Button
          title="친구추가"
          onPress={() => setAddFriendModalVisible(true)}
        />
      </View>

      {/* 채팅방 목록 */}
      <FlatList
        data={chatRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
      />

      {/* 친구추가 모달 */}
      <AddFriendModal
        visible={isAddFriendModalVisible}
        onClose={() => setAddFriendModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4EC",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // 버튼을 양쪽에 배치
    padding: 10,
    backgroundColor: "#F8F4EC",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#F8F4EC",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  nameTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  unreadBadge: {
    backgroundColor: "#007bff",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChattingRoomScreen;
