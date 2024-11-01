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
import AddFriendScreen from "./AddFriendScreen";
import { ref, onValue, update, set } from "firebase/database";
import { dbRealtime } from "../firebase/FirebaseConfig";
import { getAuth } from "firebase/auth";
import { getUserNameByUid } from "../firebase/firestoreService"; // 함수 불러오기

const ChattingRoomScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [nicknames, setNicknames] = useState({});
  const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      Alert.alert("오류", "로그인된 사용자가 없습니다.");
      navigation.navigate("LoginScreen");
      return;
    }

    const chatRoomsRef = ref(dbRealtime, "chatRooms");
    const unsubscribe = onValue(chatRoomsRef, async (snapshot) => {
      const rooms = [];
      const nicknamePromises = [];

      snapshot.forEach((childSnapshot) => {
        const roomData = childSnapshot.val();

        // 참가자 목록이 없는 경우 자동으로 추가
        if (!roomData.participants) {
          const participants = [user.uid];
          addParticipantsToChatRoom(childSnapshot.key, participants);
        }

        if (roomData?.participants && Array.isArray(roomData.participants)) {
          if (roomData.participants.includes(user.uid)) {
            rooms.push({ id: childSnapshot.key, ...roomData });

            const otherParticipantUid = roomData.participants.find(
              (uid) => uid !== user.uid
            );

            if (otherParticipantUid) {
              const nicknamePromise = getUserNameByUid(
                otherParticipantUid
              ).then((userName) => {
                setNicknames((prevNicknames) => ({
                  ...prevNicknames,
                  [childSnapshot.key]: userName || "알 수 없음",
                }));
              });
              nicknamePromises.push(nicknamePromise);
            }
          }
        }
      });

      await Promise.all(nicknamePromises);
      setChatRooms(rooms);
    });

    return () => unsubscribe();
  }, [user]);

  const addParticipantsToChatRoom = async (roomId, participants) => {
    try {
      const roomRef = ref(dbRealtime, `chatRooms/${roomId}`);

      onValue(
        roomRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const roomData = snapshot.val();

            if (!roomData.participants) {
              update(roomRef, {
                participants: participants,
              });
            }
          } else {
            set(roomRef, {
              participants: participants,
              lastMessage: "",
              lastMessageTime: new Date().toISOString(),
            });
          }
        },
        { onlyOnce: true }
      );
    } catch (error) {
      console.error("participants 필드 추가 오류:", error);
    }
  };

  const handleRoomSelect = (roomId, participants) => {
    navigation.navigate("ChattingScreen", { roomId, participants });
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.roomContainer}
      onPress={() => handleRoomSelect(item.id, item.participants)}
    >
      <Image
        source={{
          uri: "https://randomuser.me/api/portraits/men/1.jpg",
        }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.name}>{nicknames[item.id] || "상대방 이름"}</Text>
          <Text style={styles.time}>
            {item.lastMessageTime
              ? new Date(item.lastMessageTime).toLocaleTimeString()
              : ""}
          </Text>
        </View>
        <Text style={styles.message}>
          {item.lastMessage || "메시지가 없습니다."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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

      <AddFriendScreen
        visible={isAddFriendModalVisible}
        onClose={() => setAddFriendModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F4EC", paddingTop: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  textContainer: { flex: 1 },
  nameTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  time: { fontSize: 12, color: "#999" },
  message: { fontSize: 14, color: "#666" },
  noChatRooms: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ChattingRoomScreen;
