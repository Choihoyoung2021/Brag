import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { signUpUser } from "../firebase/signUpLogic"; // 회원가입 함수 import

export const SignUpScreen = ({ onSignUp }) => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    // 비밀번호 길이 확인 및 일치 여부 확인
    if (password.length < 6) {
      Alert.alert("회원가입 오류", "비밀번호는 6자 이상을 입력해주세요."); // 사용자에게 메시지 알림
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("회원가입 오류", "비밀번호가 일치하지 않습니다."); // 사용자에게 메시지 알림
      return;
    }

    try {
      // 회원가입 로직 호출
      const result = await onSignUp({ userId, userName, password });
      if (result) {
        Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.");
      }
    } catch (error) {
      Alert.alert("회원가입 오류", error.message); // 오류 메시지를 사용자에게 알림
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff", padding: 20 }}
      >
        <Text style={styles.title}>회원가입</Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCompleteType="off"
          keyboardType="default"
          textContentType="newPassword" // 새 비밀번호로 설정
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCompleteType="off"
          keyboardType="default"
          textContentType="newPassword" // 새 비밀번호로 설정
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>회원가입</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  signUpText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
