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

      // 채팅방 생성 또는 업데이트
      onValue(
        roomRef,
        (snapshot) => {
          if (!snapshot.exists()) {
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

  const renderItem = ({ item }) => {
    const isSelf = item.senderUid === user.uid;
    const messageTime = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isSelf ? styles.selfMessage : styles.otherMessage,
        ]}
      >
        {!isSelf && <Text style={styles.messageTime}>{messageTime}</Text>}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        {isSelf && <Text style={styles.messageTime}>{messageTime}</Text>}
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
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  selfMessage: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  otherMessage: { alignSelf: "flex-start" },
  messageBubble: {
    maxWidth: "75%",
    backgroundColor: "#D8D8D8",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  messageText: { color: "#000" },
  messageTime: {
    fontSize: 10,
    color: "#999",
    marginHorizontal: 5,
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
