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
  deleteDoc,
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

// 게시물 추가 함수 (카테고리 포함, 기존 posts 컬렉션용)
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

// Dog 게시물 추가 함수 (dog_posts 컬렉션 사용)
export const addDogPost = async (
  title,
  content,
  imageUrls = [],
  imageNames = []
) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userName = await getUserNameByUid(user.uid);
      const dogPostsCollection = collection(db, "dog_posts");
      await addDoc(dogPostsCollection, {
        title,
        content,
        createdAt: new Date(),
        uid: user.uid,
        user_name: userName,
        imageUrls, // 이미지 URL 배열 저장
        imageNames, // 이미지 파일 이름 배열 저장
        likes: [],
      });
    } else {
      throw new Error("로그인된 사용자가 없습니다.");
    }
  } catch (error) {
    console.error("Error adding dog post: ", error);
    throw error;
  }
};

// Cat 게시물 추가 함수 (cat_posts 컬렉션 사용)
export const addCatPost = async (
  title,
  content,
  imageUrls = [],
  imageNames = []
) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userName = await getUserNameByUid(user.uid);
      const catPostsCollection = collection(db, "cat_posts");
      await addDoc(catPostsCollection, {
        title,
        content,
        createdAt: new Date(),
        uid: user.uid,
        user_name: userName,
        imageUrls, // 이미지 URL 배열 저장
        imageNames, // 이미지 파일 이름 배열 저장
        likes: [],
      });
    } else {
      throw new Error("로그인된 사용자가 없습니다.");
    }
  } catch (error) {
    console.error("Error adding cat post: ", error);
    throw error;
  }
};

// 카테고리별 게시물 가져오기 함수 (기존 posts 컬렉션)
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

// 모든 게시물 가져오기 함수 (기존 posts 컬렉션)
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

// Dog 게시물 가져오기 함수 (dog_posts 컬렉션에서)
export const getDogPosts = async () => {
  try {
    const dogPostsCollection = collection(db, "dog_posts");
    const dogPostsQuery = query(
      dogPostsCollection,
      orderBy("createdAt", "desc")
    );
    const dogPostsSnapshot = await getDocs(dogPostsQuery);
    return dogPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting dog posts: ", error);
    return [];
  }
};

// Cat 게시물 가져오기 함수 (cat_posts 컬렉션에서)
export const getCatPosts = async () => {
  try {
    const catPostsCollection = collection(db, "cat_posts");
    const catPostsQuery = query(
      catPostsCollection,
      orderBy("createdAt", "desc")
    );
    const catPostsSnapshot = await getDocs(catPostsQuery);
    return catPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting cat posts: ", error);
    return [];
  }
};

// 댓글 추가 함수
export const addComment = async (
  postId,
  commentText,
  isDogPost = false,
  isCatPost = false
) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";

    const userName = await getUserNameByUid(user.uid);
    const commentCollection = collection(
      db,
      collectionName,
      postId,
      "comments"
    );
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
export const getComments = async (
  postId,
  isDogPost = false,
  isCatPost = false
) => {
  try {
    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";

    const commentsCollection = collection(
      db,
      collectionName,
      postId,
      "comments"
    );
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

// 좋아요 상태를 토글하는 함수
export const toggleLikePost = async (
  postId,
  isDogPost = false,
  isCatPost = false
) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";

    const postRef = doc(db, collectionName, postId);
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

// 게시물 좋아요를 누른 사용자 UID 목록을 가져오는 함수
export const getLikesData = async (
  postId,
  isDogPost = false,
  isCatPost = false
) => {
  try {
    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";

    const postRef = doc(db, collectionName, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

    const likes = postSnap.data().likes || [];
    return likes;
  } catch (error) {
    console.error("좋아요 데이터 가져오기 오류:", error);
    return [];
  }
};

// 게시물 좋아요 수를 가져오는 함수
export const getLikesCount = async (
  postId,
  isDogPost = false,
  isCatPost = false
) => {
  try {
    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";

    const postRef = doc(db, collectionName, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) throw new Error("게시글이 존재하지 않습니다.");

    const likes = postSnap.data().likes || [];
    return likes.length;
  } catch (error) {
    console.error("좋아요 수 가져오기 오류:", error);
    throw error;
  }
};

// 게시물 삭제 함수
export const deletePost = async (
  postId,
  isDogPost = false,
  isCatPost = false
) => {
  try {
    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";

    const postRef = doc(db, collectionName, postId);
    await deleteDoc(postRef);
    console.log("게시물이 삭제되었습니다:", postId);
  } catch (error) {
    console.error("게시물 삭제 오류:", error);
    throw error;
  }
};
