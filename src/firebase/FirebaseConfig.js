// FirebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // 추가된 import
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage import

const firebaseConfig = {
  apiKey: "AIzaSyBTSZ7g3nR6xLt3Mo5Dnf8bYjWv3KfGwDc",
  authDomain: "brag-1e4ef.firebaseapp.com",
  projectId: "brag-1e4ef",
  storageBucket: "brag-1e4ef.appspot.com",
  messagingSenderId: "690566936784",
  appId: "1:690566936784:web:40f894420e6dfba6de06d5",
  measurementId: "G-1KS71PE1WZ",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(app);

// Firebase Auth 초기화 (AsyncStorage 사용 설정)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { db, auth };
