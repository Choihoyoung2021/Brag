// ChattingRoomScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import AddFriendScreen from "./AddFriendScreen"; // 새로 만든 모달 추가
import { getChatRooms } from "../firebase/firestoreService"; // getChatRooms 함수 추가
import { getAuth } from "firebase/auth";

const ChattingRoomScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      Alert.alert("오류", "로그인된 사용자가 없습니다.");
      navigation.navigate("LoginScreen"); // 로그인 화면으로 이동
      return;
    }

    const fetchChatRooms = async () => {
      try {
        const rooms = await getChatRooms(user.uid);
        setChatRooms(rooms);
      } catch (error) {
        console.error("채팅방 목록 가져오기 오류:", error);
        // 오류는 콘솔에만 기록하고, Alert는 표시하지 않음
        setChatRooms([]);
      }
    };

    fetchChatRooms();
  }, [user]);

  const handleRoomSelect = (roomId, participants) => {
    navigation.navigate("ChattingScreen", { roomId, participants });
  };

  const renderRoom = ({ item }) => {
    if (!item.participants) {
      return null; // participants가 없으면 렌더링하지 않음
    }

    // 현재 사용자 외의 참가자 정보 가져오기
    const otherParticipantUid = item.participants.find(
      (uid) => uid !== user.uid
    );

    if (!otherParticipantUid) {
      return null; // 다른 참가자가 없으면 렌더링하지 않음
    }

    return (
      <TouchableOpacity
        style={styles.roomContainer}
        onPress={() => handleRoomSelect(item.id, item.participants)}
      >
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/men/1.jpg", // 실제로는 상대방의 avatar를 가져와야 합니다.
          }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <View style={styles.nameTimeContainer}>
            <Text style={styles.name}>상대방 이름</Text>
            <Text style={styles.time}>
              {item.lastMessage ? item.lastMessage : "최근 메시지 없음"}
            </Text>
          </View>
          <Text style={styles.message}>
            {item.lastMessage || "메시지가 없습니다."}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
      {chatRooms.length === 0 ? (
        <View style={styles.noChatRooms}>
          <Text>채팅방이 없습니다. 친구를 추가하고 메시지를 보내보세요!</Text>
        </View>
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* 친구추가 모달 */}
      <AddFriendScreen
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
  noChatRooms: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChattingRoomScreen;
