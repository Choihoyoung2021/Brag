// firestoreService.js
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./FirebaseConfig";

export const getAllPosts = async () => {
  try {
    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);
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
  }
};

export const searchPosts = async (searchText) => {
  try {
    const postsCollection = collection(db, "posts");
    const q = query(
      postsCollection,
      where("title", ">=", searchText),
      where("title", "<=", searchText + "\uf8ff")
    );
    const postsSnapshot = await getDocs(q);
    const postsList = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return postsList;
  } catch (error) {
    console.error("Error searching posts: ", error);
    return [];
  }
};
