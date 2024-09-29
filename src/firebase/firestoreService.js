// firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { getAuth } from "firebase/auth";

// 게시물 추가 함수
export const addPost = async (title, content) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const postsCollection = collection(db, "posts");
      await addDoc(postsCollection, {
        title,
        content,
        createdAt: new Date(),
        userId: user.uid,
        userEmail: user.email,
      });
    } else {
      throw new Error("로그인된 사용자가 없습니다.");
    }
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error;
  }
};

// 댓글 추가 함수
export const addComment = async (postId, comment) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const commentsCollection = collection(db, "posts", postId, "comments");
      await addDoc(commentsCollection, {
        comment,
        createdAt: new Date(),
        userId: user.uid,
        userEmail: user.email,
      });
    } else {
      throw new Error("로그인된 사용자가 없습니다.");
    }
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

// 모든 게시물 가져오기 함수
export const getAllPosts = async () => {
  try {
    const postsCollection = collection(db, "posts");
    const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));
    const postsSnapshot = await getDocs(postsQuery);
    const postsList = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return postsList;
  } catch (error) {
    console.error("Error getting posts: ", error);
    return [];
  }
};

// 댓글 가져오기 함수 추가
export const getComments = async (postId) => {
  try {
    const commentsCollection = collection(db, "posts", postId, "comments");
    const commentsQuery = query(
      commentsCollection,
      orderBy("createdAt", "asc")
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting comments: ", error);
    return [];
  }
};
