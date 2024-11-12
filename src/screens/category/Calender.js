import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { addMemo, getMemo, getAllMemos } from "../../firebase/firestoreService";
import moment from "moment";
import "moment/locale/ko";

moment.locale("ko");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [memo, setMemo] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [savedMemo, setSavedMemo] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [lastClickedDate, setLastClickedDate] = useState(null);

  useEffect(() => {
    const fetchMarkedDates = async () => {
      const memoDates = await getAllMemos();
      const newMarkedDates = {};
      memoDates.forEach((date) => {
        newMarkedDates[date] = { marked: true, dotColor: "red" };
      });
      setMarkedDates(newMarkedDates);
    };
    fetchMarkedDates();

    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("알림 권한 필요", "알림을 받으려면 권한을 허용하세요.");
    }
  };

  const handleDayPress = async (day) => {
    const clickedDate = day.dateString;
    const memoData = await getMemo(clickedDate);

    // 같은 날짜를 두 번 클릭했을 때 수정 모달 열기
    if (clickedDate === lastClickedDate) {
      setIsModalVisible(true);
      setMemo(memoData?.memo || "");
      setSelectedDate(clickedDate);
      setSavedMemo(memoData);
    } else {
      // 첫 번째 클릭 시 저장된 메모만 표시
      setSavedMemo(memoData);
      setSelectedDate(clickedDate);
      setLastClickedDate(clickedDate);
    }
  };

  const handleSaveMemo = async () => {
    if (memo.trim() === "") {
      Alert.alert("경고", "메모를 입력하세요.");
      return;
    }
    await addMemo(selectedDate, memo);
    Alert.alert("성공", "메모가 저장되었습니다.");
    setIsModalVisible(false);
    setMarkedDates((prevDates) => ({
      ...prevDates,
      [selectedDate]: { marked: true, dotColor: "red" },
    }));
    if (selectedTime) {
      await scheduleNotification(selectedDate, selectedTime);
    }
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowTimePicker(false);
    setSelectedTime(currentDate);
  };

  const scheduleNotification = async (date, time) => {
    const notificationDate = new Date(date);
    notificationDate.setHours(time.getHours());
    notificationDate.setMinutes(time.getMinutes());
    notificationDate.setSeconds(0);

    if (notificationDate <= new Date()) {
      Alert.alert("경고", "미래의 시간을 선택하세요.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📅 알림",
        body: `선택하신 일정: ${memo}`,
        sound: true,
      },
      trigger: { seconds: (notificationDate.getTime() - Date.now()) / 1000 },
    });

    Alert.alert(
      "알림 설정 완료",
      `${notificationDate.toLocaleString()}에 알림이 울립니다.`
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split("T")[0]}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        style={styles.calendar}
        locale={"ko"}
        monthFormat={"yyyy년 MM월"}
        firstDay={0}
        enableSwipeMonths={true}
      />

      {savedMemo && (
        <View style={styles.memoContainer}>
          <Text style={styles.memoText}>내용: {savedMemo.memo}</Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="메모를 입력하세요"
              value={memo}
              onChangeText={setMemo}
              multiline
            />
            <Button title="시간 선택" onPress={() => setShowTimePicker(true)} />
            {selectedTime && (
              <Text>선택된 시간: {selectedTime.toLocaleTimeString()}</Text>
            )}
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                onChange={handleTimeChange}
              />
            )}
            <Button title="저장하기" onPress={handleSaveMemo} />
            <Button title="닫기" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F8F4EC",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#F8F4EC",
  },
  memoContainer: { marginTop: 20 },
  memoText: { fontSize: 16, backgroundColor: "#F8F4EC" },
  modalContainer: { flex: 1, justifyContent: "center" },
  modalContent: { padding: 20, backgroundColor: "#f8e9d7", borderRadius: 10 },
  input: {
    height: 100,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
});

export default CalendarScreen;
