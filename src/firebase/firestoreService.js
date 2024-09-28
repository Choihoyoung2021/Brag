// firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";

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

// 게시물 추가 함수
export const addPost = async (title, content) => {
  try {
    const postsCollection = collection(db, "posts");
    await addDoc(postsCollection, {
      title,
      content,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error; // 에러를 호출자에게 전달
  }
};

export const addComment = async (postId, comment) => {
  try {
    const commentsCollection = collection(db, "posts", postId, "comments");
    await addDoc(commentsCollection, {
      comment,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

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
