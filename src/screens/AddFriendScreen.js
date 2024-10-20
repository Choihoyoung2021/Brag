import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig"; // Firebase 설정 파일
import { getAuth } from "firebase/auth"; // Firebase 인증

const AddFriendScreen = ({ visible, onClose }) => {
  const [friendNickname, setFriendNickname] = useState("");
  const [friendProfile, setFriendProfile] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const searchFriend = async () => {
    if (!friendNickname) {
      Alert.alert("오류", "닉네임을 입력하세요.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("user_name", "==", friendNickname));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("오류", "해당 닉네임을 가진 사용자가 없습니다.");
        setFriendProfile(null);
        return;
      }

      // 사용자 정보를 가져와 표시 (첫 번째 사용자만 표시)
      const targetUser = querySnapshot.docs[0].data();
      setFriendProfile({
        uid: targetUser.uid,
        name: targetUser.user_name,
        avatar:
          targetUser.avatar || "https://randomuser.me/api/portraits/men/1.jpg", // 프로필 이미지가 없으면 기본 이미지
      });
    } catch (error) {
      console.error("사용자 검색 오류:", error);
      Alert.alert("오류", "사용자 검색 중 오류가 발생했습니다.");
    }
  };

  const sendFriendRequest = async () => {
    if (!friendProfile) {
      Alert.alert("오류", "먼저 친구를 검색하세요.");
      return;
    }

    try {
      await addDoc(collection(db, "friend_requests"), {
        from_uid: user.uid,
        to_uid: friendProfile.uid,
        createdAt: new Date(),
      });

      Alert.alert("성공", "친구 요청이 전송되었습니다.");
      onClose(); // 요청 후 모달 닫기
    } catch (error) {
      console.error("친구 요청 오류:", error);
      Alert.alert("오류", "친구 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>친구 추가</Text>

          <TextInput
            style={styles.input}
            value={friendNickname}
            onChangeText={setFriendNickname}
            placeholder="닉네임을 입력하세요"
            maxLength={20}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchFriend}>
            <Text style={styles.searchButtonText}>친구 검색</Text>
          </TouchableOpacity>

          {friendProfile && (
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: friendProfile.avatar }}
                style={styles.profilePicture}
              />
              <Text style={styles.profileName}>{friendProfile.name}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={sendFriendRequest}
          >
            <Text style={styles.addButtonText}>친구 추가</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#F8F4EC",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default AddFriendScreen;
