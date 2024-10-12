//Announcement.js 파일
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const Announcement = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.announcementBox}>
        <Text style={styles.title}>공지사항</Text>
        <Text style={styles.date}>2024년 9월 6일</Text>
        <Text style={styles.content}>
          안녕하세요! 여러분께 중요한 공지사항을 전해드리게 되어 기쁩니다. 앱의
          새로운 업데이트와 관련된 내용이 포함되어 있으니, 확인 부탁드립니다. 더
          나은 서비스를 제공하기 위해 노력하겠습니다. 감사합니다!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F8F4EC",
  },
  announcementBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

export default Announcement;
