// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTSZ7g3nR6xLt3Mo5Dnf8bYjWv3KfGwDc",
  authDomain: "brag-1e4ef.firebaseapp.com",
  projectId: "brag-1e4ef",
  storageBucket: "brag-1e4ef.appspot.com",
  messagingSenderId: "690566936784",
  appId: "1:690566936784:web:40f894420e6dfba6de06d5",
  measurementId: "G-1KS71PE1WZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
