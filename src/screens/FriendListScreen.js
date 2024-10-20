import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getFriendsList,
  getOrCreateChatRoom,
} from "../firebase/firestoreService"; // getOrCreateChatRoom 추가
import { getAuth } from "firebase/auth";

const FriendListScreen = () => {
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await getFriendsList();
        setFriends(friendsData);
      } catch (error) {
        console.error("친구 목록 가져오기 오류:", error);
        Alert.alert("오류", "친구 목록을 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchFriends();
  }, []);

  const handleFriendPress = (friend) => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "메세지 보내기", "프로필 보기"],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            sendMessage(friend);
          } else if (buttonIndex === 2) {
            viewProfile(friend);
          }
        }
      );
    } else {
      Alert.alert(
        "옵션 선택",
        `${friend.user_name}님에게 할 작업을 선택하세요.`,
        [
          { text: "메세지 보내기", onPress: () => sendMessage(friend) },
          { text: "프로필 보기", onPress: () => viewProfile(friend) },
          { text: "취소", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const sendMessage = async (friend) => {
    try {
      const roomId = await getOrCreateChatRoom(user.uid, friend.uid);
      navigation.navigate("ChattingScreen", {
        roomId,
        participants: [user.uid, friend.uid],
      });
    } catch (error) {
      console.error("채팅방 생성 오류:", error);
      Alert.alert("오류", "채팅방을 생성하는 중 오류가 발생했습니다.");
    }
  };

  const viewProfile = (friend) => {
    Alert.alert("프로필 보기", `${friend.user_name}의 프로필을 확인합니다.`);
    // 여기서 프로필 보기 화면으로 네비게이션할 수 있습니다.
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => handleFriendPress(item)}
    >
      <Image
        source={{
          uri: item.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
        }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.user_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>친구목록</Text>
        <Text style={styles.subHeaderText}>{friends.length}명</Text>
        <TouchableOpacity
          style={styles.newFriendButton}
          onPress={() => navigation.navigate("NewFriendRequestsScreen")}
        >
          <Text style={styles.newFriendButtonText}>새 친구</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by names"
        value={searchText}
        onChangeText={setSearchText}
      />
      {friends.length === 0 ? (
        <View style={styles.noFriends}>
          <Text>친구가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={friends.filter((friend) =>
            friend.user_name.toLowerCase().includes(searchText.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.uid} // uid는 유니크해야 합니다.
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4EC",
  },
  header: {
    padding: 20,
    backgroundColor: "#F8F4EC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#999",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  newFriendButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  newFriendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  noFriends: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendListScreen;
