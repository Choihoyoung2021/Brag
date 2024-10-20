// NewFriendRequestsScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  getIncomingFriendRequests,
  acceptFriendRequest,
  getUserByUid,
} from "../firebase/firestoreService"; // 경로는 프로젝트 구조에 맞게 조정
import { getAuth } from "firebase/auth";

const NewFriendRequestsScreen = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const requests = await getIncomingFriendRequests();
        // 요청자 정보 가져오기
        const requestsWithUserData = await Promise.all(
          requests.map(async (req) => {
            const fromUser = await getUserByUid(req.from_uid);
            return {
              id: req.id,
              from_uid: req.from_uid,
              from_user_name: fromUser ? fromUser.user_name : "Unknown",
            };
          })
        );
        setFriendRequests(requestsWithUserData);
      } catch (error) {
        console.error("친구 요청 가져오기 오류:", error);
        Alert.alert("오류", "친구 요청을 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      Alert.alert("성공", "친구 요청을 수락했습니다.");
      // 수락한 요청 제거
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("친구 요청 수락 오류:", error);
      Alert.alert("오류", "친구 요청을 수락하는 중 오류가 발생했습니다.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>
        {item.from_user_name}님이 친구 요청을 보냈습니다.
      </Text>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAccept(item.id)}
      >
        <Text style={styles.acceptButtonText}>수락</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {friendRequests.length === 0 ? (
        <Text style={styles.noRequestsText}>받은 친구 요청이 없습니다.</Text>
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F4EC",
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2, // Android 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  requestText: {
    fontSize: 16,
    color: "#333",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noRequestsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});

export default NewFriendRequestsScreen;
