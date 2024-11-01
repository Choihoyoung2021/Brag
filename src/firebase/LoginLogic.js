// LoginLogic.js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Firebase Auth import
import { Alert } from "react-native"; // React Native Alert 컴포넌트

export const handleLogin = async (userId, password) => {
  const auth = getAuth(); // Firebase Auth 객체 가져오기
  try {
    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userId)) {
      throw new Error("아이디는 이메일 형식이어야 합니다.");
    }

    // Firebase Auth를 통해 로그인
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userId,
      password
    );

    const user = userCredential.user;
    console.log("로그인 성공:", user.email);
    return true; // 로그인 성공
  } catch (error) {
    console.error("로그인 오류:", error);
    Alert.alert("로그인 오류", error.message); // 오류 메시지를 사용자에게 알림
    return false; // 오류 발생 시 로그인 실패
  }
};
