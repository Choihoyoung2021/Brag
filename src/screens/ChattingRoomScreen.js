// ChatRoomsScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ChatRoomsScreen = ({ navigation }) => {
  const chatRooms = [
    { id: "1", name: "채팅방 1" },
    { id: "2", name: "채팅방 2" },
    // 더 많은 채팅방 추가
  ];

  const handleRoomSelect = (roomId) => {
    navigation.navigate("ChattingScreen", { roomId });
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomContainer}
      onPress={() => handleRoomSelect(item.id)}
    >
      <Text style={styles.roomName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 50,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  roomContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  roomName: {
    fontSize: 18,
    color: "#333",
  },
});

export default ChatRoomsScreen;
