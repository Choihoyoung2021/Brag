import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { handleLogin } from "../firebase/LoginLogic"; // 로그인 로직 가져오기

const LoginInputScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(""); // 아이디
  const [password, setPassword] = useState(""); // 비밀번호

  // 로그인 함수
  const login = async () => {
    if (!userId || !password) {
      Alert.alert("입력 오류", "아이디와 비밀번호를 모두 입력하세요.");
      return; // 빈 입력 처리
    }

    const success = await handleLogin(userId, password);
    if (success) {
      navigation.replace("MainTabs"); // 로그인 성공 시 MainTabs으로 이동
    } else {
      Alert.alert("로그인 실패", "아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>로그인</Text>

        <TextInput style={styles.input} placeholder="아이디" value={userId} onChangeText={setUserId} />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>회원가입하러 가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
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
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  loginText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#4CAF50",
  },
});

export default LoginInputScreen;
