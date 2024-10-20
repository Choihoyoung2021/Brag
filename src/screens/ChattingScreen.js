// ChattingScreen.js

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
  Image, // Image 임포트 추가
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase/FirebaseConfig"; // Firebase 설정
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getUserByUid } from "../firebase/firestoreService"; // 상대방 정보 가져오기

const ChattingScreen = ({ route, navigation }) => {
  const { roomId, participants } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const flatListRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!participants || !Array.isArray(participants)) {
      Alert.alert("오류", "참가자 정보가 올바르지 않습니다.");
      navigation.goBack();
      return;
    }

    if (!user) {
      Alert.alert("오류", "로그인된 사용자가 없습니다.");
      navigation.navigate("LoginScreen"); // 로그인 화면으로 이동
      return;
    }

    const fetchOtherUser = async () => {
      const otherUid = participants.find((uid) => uid !== user.uid);
      if (otherUid) {
        const userData = await getUserByUid(otherUid);
        setOtherUser(userData);
      }
    };

    fetchOtherUser();
  }, [participants, user]);

  // 실시간으로 메시지 가져오기
  useEffect(() => {
    if (!roomId) return;

    const messagesQuery = query(
      collection(db, "chats", roomId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      await addDoc(collection(db, "chats", roomId, "messages"), {
        text: message,
        senderUid: user.uid,
        createdAt: new Date(),
      });

      // 채팅방의 마지막 메시지 업데이트
      const chatRoomRef = doc(db, "chats", roomId);
      await updateDoc(chatRoomRef, {
        lastMessage: message,
        updatedAt: new Date(),
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
        <View style={styles.header}>
          {otherUser && (
            <View style={styles.headerInfo}>
              <Image
                source={{
                  uri:
                    otherUser.avatar ||
                    "https://randomuser.me/api/portraits/men/1.jpg",
                }}
                style={styles.headerAvatar}
              />
              <Text style={styles.headerName}>{otherUser.user_name}</Text>
            </View>
          )}
        </View>
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
  header: {
    padding: 10,
    backgroundColor: "#F8F4EC",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
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
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
  },
});

export default ChattingScreen;
