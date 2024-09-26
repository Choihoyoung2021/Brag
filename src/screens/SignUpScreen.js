// SignUpScreen.js
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { loginUser } from "../firebase/LoginLogic";
export const SignUpScreen = ({ onSignUp }) => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    onSignUp({ userId, userName, password });
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
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp} // handleSignUp 함수 호출
        >
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
