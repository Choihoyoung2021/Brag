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
  where, // <-- 여기에서 where 함수를 추가로 임포트
} from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { getAuth } from "firebase/auth";

// 특정 uid를 통해 user_name 가져오기 함수
const getUserNameByUid = async (uid) => {
  try {
    console.log("Fetching user name for UID:", uid); // UID 확인 로그
    const usersCollection = collection(db, "users");
    const usersQuery = query(usersCollection, where("uid", "==", uid)); // uid 필드 기준으로 검색
    const usersSnapshot = await getDocs(usersQuery);

    if (!usersSnapshot.empty) {
      const userData = usersSnapshot.docs[0].data();
      return userData.user_name || ""; // user_name이 있으면 반환, 없으면 빈 문자열
    } else {
      console.error("해당 UID의 사용자가 존재하지 않습니다. UID:", uid);
      throw new Error("해당 UID의 사용자가 존재하지 않습니다.");
    }
  } catch (error) {
    console.error("Error getting user name by UID: ", error);
    return "";
  }
};

// 게시물 추가 함수
export const addPost = async (title, content) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userName = await getUserNameByUid(user.uid); // uid를 통해 user_name 가져오기
      const postsCollection = collection(db, "posts");
      await addDoc(postsCollection, {
        title,
        content,
        createdAt: new Date(),
        uid: user.uid,
        user_name: userName, // user_name 저장
        likes: [], // 좋아요 리스트 추가
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
export const addComment = async (postId, commentText) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    const userName = await getUserNameByUid(user.uid); // uid를 통해 user_name 가져오기
    const commentCollection = collection(db, "posts", postId, "comments");
    await addDoc(commentCollection, {
      uid: user.uid, // 댓글 작성자 UID 저장
      user_name: userName, // user_name 저장
      commentText, // 댓글 내용 저장
      createdAt: new Date(), // 생성일시 저장
    });
  } catch (error) {
    console.error("댓글 추가 오류:", error);
    throw error;
  }
};

// 모든 게시물 가져오기 함수
export const getAllPosts = async () => {
  try {
    const postsCollection = collection(db, "posts");

    // 작성 날짜 기준 내림차순 정렬
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

// 좋아요 목록 가져오기 함수 (postLikes 배열 데이터 반환)
export const getLikesData = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

    // likes 배열이 존재하는지 확인하고 반환
    return postSnap.data().likes || [];
  } catch (error) {
    console.error("Error getting likes data: ", error);
    throw error;
  }
};

// 게시물 좋아요 상태를 토글하는 함수 (좋아요/좋아요 취소)
export const toggleLikePost = async (postId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

    const postLikes = postSnap.data().likes || [];

    // 사용자가 이미 좋아요를 눌렀는지 확인
    const hasLiked = postLikes.includes(user.uid);

    if (hasLiked) {
      // 이미 좋아요를 눌렀다면 좋아요 취소
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid), // 해당 사용자의 UID를 좋아요 배열에서 제거
      });
    } else {
      // 좋아요를 누르지 않았다면 좋아요 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid), // 해당 사용자의 UID를 좋아요 배열에 추가
      });
    }

    return !hasLiked; // 좋아요 상태가 변경된 후의 결과 반환 (true: 좋아요 추가, false: 좋아요 취소)
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
    return likes.length; // 좋아요 수 반환
  } catch (error) {
    console.error("좋아요 수 가져오기 오류:", error);
    throw error;
  }
};
