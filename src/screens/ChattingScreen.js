//ChattingScreen.js
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

const ChattingScreen = ({ route, navigation }) => {
  const { roomId, participants } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = ref(dbRealtime, `chatRooms/${roomId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((childSnapshot) => {
        newMessages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const roomRef = ref(dbRealtime, `chatRooms/${roomId}`);

      // roomRef에서 데이터를 가져올 때 onValue를 사용하여 한 번만 가져옵니다.
      onValue(
        roomRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            // 채팅방이 없으면 생성
            update(roomRef, {
              participants: participants,
              lastMessage: message,
              lastMessageTime: new Date().toISOString(),
            });
          }
        },
        { onlyOnce: true }
      );

      // 메시지 추가
      const newMessageRef = push(
        ref(dbRealtime, `chatRooms/${roomId}/messages`)
      );
      const messageData = {
        text: message,
        senderUid: user.uid,
        createdAt: new Date().toISOString(),
      };

      await update(newMessageRef, messageData);

      // 채팅방의 마지막 메시지 정보 업데이트
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

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderUid === user.uid ? styles.selfMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

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
          keyExtractor={(item) => item.id}
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
  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 10 },
  selfMessage: { alignSelf: "flex-end", backgroundColor: "#D8D8D8" },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#D8D8D8" },
  messageText: { color: "#000000" },
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
