// firebase/LoginLogic.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./FirebaseConfig";

export const handleLogin = async (userId, password) => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(
      usersCollection,
      where("user_id", "==", userId),
      where("password", "==", password)
    );

    const usersSnapshot = await getDocs(q);

    // 사용자가 존재하는지 확인
    if (!usersSnapshot.empty) {
      return true; // 로그인 성공
    } else {
      return false; // 로그인 실패
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    return false; // 오류 발생 시 로그인 실패
  }
};
