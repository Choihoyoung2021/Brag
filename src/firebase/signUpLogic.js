import { collection, addDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { Alert } from "react-native"; // Alert 추가

export const signUpUser = async ({ userId, userName, password }) => {
  try {
    await addDoc(collection(db, "users"), {
      user_id: userId,
      user_name: userName,
      password: password,
      created_at: new Date(),
    });

    console.log("User signed up successfully!");
    return true; // 회원가입 성공
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error; // 오류 발생 시 다시 던지기
  }
};
