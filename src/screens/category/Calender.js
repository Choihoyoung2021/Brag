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
import { addMemo, getMemo, getAllMemos } from "../../firebase/firestoreService";

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [memo, setMemo] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [savedMemo, setSavedMemo] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [lastSelectedDate, setLastSelectedDate] = useState(null);

  useEffect(() => {
    const fetchMarkedDates = async () => {
      const memoDates = await getAllMemos();
      const newMarkedDates = {};
      memoDates.forEach((date) => {
        newMarkedDates[date] = {
          marked: true,
          dotColor: "red",
        };
      });
      setMarkedDates(newMarkedDates);
    };

    fetchMarkedDates();
  }, []);

  // 날짜 클릭 시 동작
  const handleDayPress = async (day) => {
    const clickedDate = day.dateString;

    // 같은 날짜를 다시 클릭하면 수정 모달 열기
    if (clickedDate === lastSelectedDate) {
      setIsModalVisible(true);
      setMemo(savedMemo?.memo || "");
      return;
    }

    // 새로운 날짜를 클릭했을 경우, 메모를 가져오기
    const memoData = await getMemo(clickedDate);
    setSelectedDate(clickedDate);
    setSavedMemo(memoData);
    setMemo(memoData?.memo || "");
    setLastSelectedDate(clickedDate);
  };

  // 메모 저장 함수
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
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split("T")[0]}
        minDate={"2023-01-01"}
        maxDate={"2024-12-31"}
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: "blue" },
        }}
        style={styles.calendar}
      />

      {/* 저장된 메모 표시 */}
      {savedMemo && (
        <View style={styles.memoContainer}>
          <Text style={styles.memoText}>내용: {savedMemo.memo}</Text>
        </View>
      )}

      {/* 메모 수정 모달 */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
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
    backgroundColor: "#F8F4EC",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  memoContainer: {
    marginTop: 20,
  },
  memoText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
});

export default CalendarScreen;
