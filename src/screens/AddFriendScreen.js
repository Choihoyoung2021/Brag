import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

const AddFriendScreen = ({ visible, onClose }) => {
  const [friendId, setFriendId] = useState("");

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
            value={friendId}
            onChangeText={setFriendId}
            placeholder="ID를 입력하세요"
            maxLength={20}
          />
          <Text style={styles.characterCount}>{friendId.length}/20</Text>

          <View style={styles.profilePictureContainer}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/men/1.jpg",
              }}
              style={styles.profilePicture}
            />
            <Text style={styles.pictureText}>동일한 ID 확인</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => console.log("친구 추가")}
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
    backgroundColor: "#fff",
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
  characterCount: {
    alignSelf: "flex-end",
    marginBottom: 10,
    color: "#888",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  pictureText: {
    marginTop: 10,
    color: "#888",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
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
