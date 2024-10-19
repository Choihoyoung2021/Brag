import React, { useState } from "react";
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

const friendsData = [
  {
    id: "1",
    name: "Adam N. Mathew",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    selected: true,
  },
  {
    id: "2",
    name: "Albert Wilson",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    selected: false,
  },
  {
    id: "3",
    name: "Andrew McLeod",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    selected: false,
  },
  {
    id: "4",
    name: "Brittany Smith",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    selected: false,
  },
];

const FriendListScreen = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleFriendPress = (friend) => {
    setSelectedFriend(friend);
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
      // Android에서는 Alert을 사용
      Alert.alert(
        "옵션 선택",
        `${friend.name}님에게 할 작업을 선택하세요.`,
        [
          { text: "메세지 보내기", onPress: () => sendMessage(friend) },
          { text: "프로필 보기", onPress: () => viewProfile(friend) },
          { text: "취소", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const sendMessage = (friend) => {
    Alert.alert("메세지 보내기", `${friend.name}에게 메세지를 보냅니다.`);
  };

  const viewProfile = (friend) => {
    Alert.alert("프로필 보기", `${friend.name}의 프로필을 확인합니다.`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => handleFriendPress(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>친구목록</Text>
        <Text style={styles.subHeaderText}>4명</Text>
      </View>
      <TextInput style={styles.searchInput} placeholder="Search by names" />
      <FlatList
        data={friendsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
});

export default FriendListScreen;
