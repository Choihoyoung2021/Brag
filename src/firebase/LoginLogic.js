import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore 메서드 임포트
import { db } from "./FirebaseConfig"; // Firestore DB 인스턴스 임포트

export const handleLogin = async (userId, password) => {
  try {
    const usersCollection = collection(db, "users"); // users 컬렉션 가져오기
    const q = query(
      usersCollection,
      where("user_id", "==", userId), // 아이디가 일치하는지 확인
      where("password", "==", password) // 비밀번호가 일치하는지 확인
    );

    const usersSnapshot = await getDocs(q); // 쿼리 실행

    // 로그 출력
    console.log("User ID:", userId);
    console.log("Password:", password);
    console.log("Users found:", usersSnapshot.empty);

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
