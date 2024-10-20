//singUpLogic.js

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth import
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "./FirebaseConfig"; // FirebaseConfig에서 db만 가져오기
import { Alert } from "react-native"; // React Native Alert 컴포넌트

export const signUpUser = async ({ userId, userName, password }) => {
  const auth = getAuth(); // Firebase Auth 객체 가져오기
  try {
    // 비밀번호 길이 확인
    if (password.length < 6) {
      throw new Error("비밀번호는 최소 6자 이상이어야 합니다.");
    }

    // Firestore에서 해당 닉네임이 이미 존재하는지 확인
    const usersCollection = collection(db, "users");
    const userQuery = query(
      usersCollection,
      where("user_name", "==", userName)
    );
    const querySnapshot = await getDocs(userQuery);

    // 만약 이미 해당 닉네임을 가진 유저가 존재한다면 회원가입을 막음
    if (!querySnapshot.empty) {
      throw new Error("이미 사용중인 닉네임 입니다.");
    }

    // Firebase Auth를 통해 회원가입
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userId,
      password
    );
    const user = userCredential.user;

    // Firestore에 사용자 정보 저장 (비밀번호는 제외)
    const userDocRef = doc(usersCollection, user.uid); // 닉네임을 문서 ID로 사용
    await setDoc(userDocRef, {
      user_id: userId,
      user_name: userName,
      uid: user.uid, // Firebase Auth에서 생성된 사용자 UID 저장
      created_at: new Date(),
      friends: [], // 친구 목록 초기화
    });

    console.log("User signed up successfully with Firebase Auth!");
    return true; // 회원가입 성공
  } catch (error) {
    console.error("회원가입 오류:", error);
    Alert.alert("회원가입 오류", error.message); // 오류 메시지를 사용자에게 알림
    throw error; // 오류 발생 시 다시 던지기
  }
};
