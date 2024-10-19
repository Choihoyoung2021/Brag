// FireStorage.js
import { storage } from "./FirebaseConfig"; // Firebase 설정 파일 경로
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadVideoToStorage = async (videoUri) => {
  try {
    const videoRef = ref(storage, `shorts/${Date.now()}.mp4`);
    const response = await fetch(videoUri);
    const blob = await response.blob();

    console.log("업로드할 blob:", blob);

    await uploadBytes(videoRef, blob); // Firebase Storage에 업로드
    const videoUrl = await getDownloadURL(videoRef); // 업로드한 비디오의 URL 가져오기

    console.log("업로드된 비디오 URL:", videoUrl);

    return videoUrl; // 비디오 URL 반환
  } catch (error) {
    console.error("비디오 업로드 오류:", error);
    throw error; // 오류 발생 시 예외 던짐
  }
};
