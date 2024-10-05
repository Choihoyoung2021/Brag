// firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { getAuth } from "firebase/auth";

// 특정 uid를 통해 user_name 가져오기 함수
const getUserNameByUid = async (uid) => {
  try {
    const usersCollection = collection(db, "users");
    const usersQuery = query(usersCollection, where("uid", "==", uid));
    const usersSnapshot = await getDocs(usersQuery);

    if (!usersSnapshot.empty) {
      const userData = usersSnapshot.docs[0].data();
      return userData.user_name || ""; // user_name이 있으면 반환, 없으면 빈 문자열 반환
    } else {
      throw new Error("해당 UID의 사용자가 존재하지 않습니다.");
    }
  } catch (error) {
    console.error("Error getting user name by UID: ", error);
    return "";
  }
};

// 게시물 추가 함수
export const addPost = async (title, content, category, imageUrls = []) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userName = await getUserNameByUid(user.uid);
      const postsCollection = collection(db, "posts");
      await addDoc(postsCollection, {
        title,
        content,
        createdAt: new Date(),
        uid: user.uid,
        user_name: userName,
        category,
        imageUrls, // 이미지 URL 배열 저장
        likes: [],
      });
    } else {
      throw new Error("로그인된 사용자가 없습니다.");
    }
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error;
  }
};

// 카테고리별 게시물 가져오기 함수
export const getPostsByCategory = async (category) => {
  try {
    const postsCollection = collection(db, "posts");
    const postsQuery = query(
      postsCollection,
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const postsSnapshot = await getDocs(postsQuery);
    return postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting posts by category: ", error);
    return [];
  }
};

// 모든 게시물 가져오기 함수 (카테고리 구분 없이)
export const getFreePosts = async () => {
  try {
    const postsCollection = collection(db, "posts");
    const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));
    const postsSnapshot = await getDocs(postsQuery);
    return postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting posts: ", error);
    return [];
  }
};

// 댓글 추가 함수
export const addComment = async (postId, commentText) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    const userName = await getUserNameByUid(user.uid);
    const commentCollection = collection(db, "posts", postId, "comments");
    await addDoc(commentCollection, {
      uid: user.uid,
      user_name: userName,
      commentText,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("댓글 추가 오류:", error);
    throw error;
  }
};

// 댓글 가져오기 함수
export const getComments = async (postId) => {
  try {
    const commentsCollection = collection(db, "posts", postId, "comments");
    const commentsQuery = query(
      commentsCollection,
      orderBy("createdAt", "asc")
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("댓글 가져오기 오류:", error);
    return [];
  }
};

// 좋아요 목록 가져오기 함수
export const getLikesData = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

    return postSnap.data().likes || [];
  } catch (error) {
    console.error("Error getting likes data: ", error);
    throw error;
  }
};

// 게시물 좋아요 상태를 토글하는 함수
export const toggleLikePost = async (postId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

    const postLikes = postSnap.data().likes || [];

    const hasLiked = postLikes.includes(user.uid);

    if (hasLiked) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) }); // 좋아요 취소
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) }); // 좋아요 추가
    }

    return !hasLiked;
  } catch (error) {
    console.error("좋아요 토글 오류:", error);
    throw error;
  }
};

// 게시물 좋아요 수를 가져오는 함수
export const getLikesCount = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

    const likes = postSnap.data().likes || [];
    return likes.length;
  } catch (error) {
    console.error("좋아요 수 가져오기 오류:", error);
    throw error;
  }
};
