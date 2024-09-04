import React, { useState } from "react";
import { StyleSheet, View, Text, Button, Modal, TextInput } from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export default function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true);
  };

  const handleDateConfirm = (date) => {
    setSelectedTime(date);
    setIsTimePickerVisible(false);
  };

  const handleSave = () => {
    setIsModalVisible(false);
    // Save the event here, e.g., save to a state or local storage
    console.log("Event saved:", {
      date: selectedDate,
      title,
      time: selectedTime,
    });
    // Show success message
    setSuccessMessage("저장되었습니다.");
    // Reset state for next selection
    setSelectedDate(null);
    setTitle("");
    setSelectedTime(null);
    // Clear success message after 2 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // Reset state if needed on cancel
    setSelectedDate(null);
    setTitle("");
    setSelectedTime(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          current={new Date().toISOString().split("T")[0]}
          minDate={new Date().toISOString().split("T")[0]}
          maxDate={"2024-12-31"}
          monthFormat={"yyyy MM"}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: "blue",
              selectedTextColor: "white",
            },
          }}
          onDayPress={onDayPress}
          style={styles.calendar}
        />
      </View>
      <View style={styles.selectedDateContainer}>
        {selectedDate ? (
          <Text style={styles.selectedDateText}>
            선택된 날짜: {selectedDate}
          </Text>
        ) : (
          <Text style={styles.selectedDateText}>날짜를 선택하세요</Text>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>일정 설정</Text>
            <TextInput
              style={styles.input}
              placeholder="일정 제목"
              value={title}
              onChangeText={setTitle}
            />
            <Button
              title={
                selectedTime
                  ? `선택된 시간: ${moment(selectedTime).format("HH:mm")}`
                  : "시간 설정"
              }
              onPress={() => setIsTimePickerVisible(true)}
            />
            <Button title="저장하기" onPress={handleSave} />
            <Button title="나가기" onPress={handleCancel} />
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleDateConfirm}
        onCancel={() => setIsTimePickerVisible(false)}
      />

      {successMessage ? (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{successMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  calendarContainer: {
    top: -50,
    width: "90%",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
  },
  calendar: {
    width: "100%",
    height: "100%",
  },
  selectedDateContainer: {
    marginTop: 20,
  },
  selectedDateText: {
    fontSize: 18,
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
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  successMessageContainer: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  successMessage: {
    color: "white",
    fontSize: 16,
  },
});
