import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { ref, onValue, push, update } from "firebase/database";
import { dbRealtime } from "../firebase/FirebaseConfig";
import { getUserNameByUid } from "../firebase/firestoreService";

const ChattingScreen = ({ route }) => {
  const { roomId, participants } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const flatListRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;

  // 채팅 메시지 가져오기
  useEffect(() => {
    if (!roomId) return;

    const messagesRef = ref(dbRealtime, `chatRooms/${roomId}/messages`);
    const unsubscribe = onValue(messagesRef, async (snapshot) => {
      const newMessages = [];
      const namesCache = { ...userNames };

      if (snapshot.exists()) {
        for (const childSnapshot of Object.values(snapshot.val())) {
          const messageData = childSnapshot;
          newMessages.push({
            id: childSnapshot.key,
            ...messageData,
          });

          const senderUid = messageData.senderUid;
          // 닉네임 캐시에 없을 경우 가져오기
          if (!namesCache[senderUid]) {
            const userName = await getUserNameByUid(senderUid);
            namesCache[senderUid] = userName;
          }
        }
      }
      setMessages(newMessages);
      setUserNames(namesCache);
    });

    return () => unsubscribe();
  }, [roomId]);

  // 메시지 전송 함수
  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const roomRef = ref(dbRealtime, `chatRooms/${roomId}`);
      const newMessageRef = push(
        ref(dbRealtime, `chatRooms/${roomId}/messages`)
      );
      const messageData = {
        text: message,
        senderUid: user.uid,
        createdAt: new Date().toISOString(),
      };

      await update(newMessageRef, messageData);
      await update(roomRef, {
        lastMessage: message,
        lastMessageTime: messageData.createdAt,
      });

      setMessage("");
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      Alert.alert("오류", "메시지를 전송하는 중 오류가 발생했습니다.");
    }
  };

  // 메시지 렌더링 함수
  const renderItem = ({ item }) => {
    const isSelf = item.senderUid === user.uid;
    const messageTime = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const senderName = isSelf
      ? "나"
      : userNames[item.senderUid] || "알 수 없는 사용자";

    return (
      <View
        style={[
          styles.messageContainer,
          isSelf ? styles.selfMessage : styles.otherMessage,
        ]}
      >
        {!isSelf && <Text style={styles.senderName}>{senderName}</Text>}
        {isSelf && <Text style={styles.messageTimeLeft}>{messageTime}</Text>}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        {!isSelf && <Text style={styles.messageTimeRight}>{messageTime}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || item.createdAt} // 고유한 key 추가
          onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="메시지를 입력하세요..."
          />
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F4EC" },
  container: { flex: 1 },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  selfMessage: {
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  otherMessage: {
    alignSelf: "flex-start",
    flexDirection: "column",
  },
  senderName: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  messageBubble: {
    maxWidth: "75%",
    backgroundColor: "#D8D8D8",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  messageText: { color: "#000" },
  messageTimeLeft: {
    fontSize: 10,
    color: "#999",
    marginRight: 5,
    alignSelf: "center",
  },
  messageTimeRight: {
    fontSize: 10,
    color: "#999",
    marginLeft: 5,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#F8F4EC",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
  },
});

export default ChattingScreen;
