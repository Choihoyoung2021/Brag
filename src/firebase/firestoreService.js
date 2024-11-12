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
  setDoc,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { getAuth } from "firebase/auth";

// 모든 메모 가져오기
export const getAllMemos = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return [];

    const memosCollection = collection(db, "calender_memos", user.uid, "memos");
    const memosSnapshot = await getDocs(memosCollection);

    return memosSnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("모든 메모 가져오기 오류:", error);
    return [];
  }
};

// 메모 저장 함수
export const addMemo = async (date, memo) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("로그인된 사용자가 없습니다.");
      return;
    }

    const uid = user.uid;
    const userName = await getUserNameByUid(uid);
    const createdAt = new Date();

    const memoRef = doc(db, "calender_memos", uid, "memos", date);
    await setDoc(memoRef, {
      memo,
      user_name: userName,
      createdAt,
    });

    console.log("메모 저장 완료");
  } catch (error) {
    console.error("메모 저장 오류:", error);
  }
};

// 특정 날짜에 대한 메모 가져오기
export const getMemo = async (date) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return null;

    const memoRef = doc(db, "calender_memos", user.uid, "memos", date);
    const memoSnap = await getDoc(memoRef);

    if (memoSnap.exists()) {
      return memoSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("메모 가져오기 오류:", error);
    return null;
  }
};

// 채팅방 가져오기 또는 생성하기
export const getOrCreateChatRoom = async (uid1, uid2) => {
  try {
    const chatsCollection = collection(db, "chats");

    // 두 사용자의 uid 배열을 정렬하여 참가자 순서를 고정
    const sortedParticipants = [uid1, uid2].sort();

    // 두 사용자가 참가하는 채팅방을 찾기 위해, 'array-contains' 한 번만 사용
    const chatQuery = query(
      chatsCollection,
      where("participants", "array-contains", sortedParticipants[0])
    );

    const querySnapshot = await getDocs(chatQuery);

    // 쿼리 결과에서 participants 배열이 정확히 일치하는 채팅방을 찾아야 함
    const existingRoom = querySnapshot.docs.find((doc) => {
      const participants = doc.data().participants;
      return (
        participants.length === sortedParticipants.length &&
        sortedParticipants.every((uid) => participants.includes(uid))
      );
    });

    if (existingRoom) {
      return existingRoom.id;
    } else {
      // 채팅방이 없으면 새로 생성
      const newChatRef = await addDoc(chatsCollection, {
        participants: sortedParticipants,
        createdAt: new Date(),
        lastMessage: "",
      });
      return newChatRef.id;
    }
  } catch (error) {
    console.error("채팅방 가져오기 또는 생성하기 오류:", error);
    throw error;
  }
};

// 채팅방 목록 가져오기
export const getChatRooms = async (uid) => {
  try {
    const chatsCollection = collection(db, "chats");
    const chatQuery = query(
      chatsCollection,
      where("participants", "array-contains", uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(chatQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("채팅방 목록 가져오기 오류:", error);
    return [];
  }
};

// 특정 uid를 통해 user 정보 가져오기 함수
export const getUserByUid = async (uid) => {
  try {
    const usersCollection = collection(db, "users");
    const usersQuery = query(usersCollection, where("uid", "==", uid));
    const usersSnapshot = await getDocs(usersQuery);

    if (!usersSnapshot.empty) {
      return usersSnapshot.docs[0].data();
    } else {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("사용자 가져오기 오류:", error);
    return null;
  }
};

// 친구 요청 가져오기 함수
export const getIncomingFriendRequests = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    const friendRequestsQuery = query(
      collection(db, "friend_requests"),
      where("to_uid", "==", user.uid)
    );

    const snapshot = await getDocs(friendRequestsQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("친구 요청 가져오기 오류:", error);
    return [];
  }
};

// 친구 요청 수락 함수
export const acceptFriendRequest = async (requestId) => {
  try {
    const requestRef = doc(db, "friend_requests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists())
      throw new Error("친구 요청이 존재하지 않습니다.");

    const requestData = requestSnap.data();
    const { from_uid, to_uid } = requestData;

    // 각 사용자 문서 참조
    const fromUserRef = doc(db, "users", from_uid);
    const toUserRef = doc(db, "users", to_uid);

    // 친구 목록 업데이트
    await updateDoc(fromUserRef, {
      friends: arrayUnion(to_uid),
    });

    await updateDoc(toUserRef, {
      friends: arrayUnion(from_uid),
    });

    // 친구 요청 삭제
    await deleteDoc(requestRef);
  } catch (error) {
    console.error("친구 요청 수락 오류:", error);
    throw error;
  }
};
// 친구 목록 가져오기 함수
export const getFriendsList = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    // 사용자 문서를 user.uid로 직접 참조
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.log("사용자 정보가 존재하지 않습니다.");
      return []; // 친구 목록이 없는 경우 빈 배열 반환
    }

    const userData = userDocSnap.data();
    const friendsUids = userData.friends || []; // 친구 목록이 없으면 빈 배열로 처리

    if (friendsUids.length === 0) return []; // 친구 목록이 없으면 빈 배열 반환

    const friendsDataPromises = friendsUids.map((uid) => getUserByUid(uid));
    const friendsData = await Promise.all(friendsDataPromises);

    return friendsData.filter((friend) => friend !== null);
  } catch (error) {
    console.error("친구 목록 가져오기 오류:", error);
    return []; // 오류 발생 시에도 빈 배열 반환
  }
};

// 특정 uid를 통해 user_name 가져오기 함수
export const getUserNameByUid = async (uid) => {
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
  isCatPost = false,
  isShortsPost = false
) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";
    if (isShortsPost) collectionName = "shorts_posts";

    //댓글 추가 함수
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
  isCatPost = false,
  isShortsPost = false
) => {
  try {
    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";
    if (isShortsPost) collectionName = "shorts_posts";

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
  isCatPost = false,
  isShortsPost = false
) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("로그인된 사용자가 없습니다.");

    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";
    if (isShortsPost) collectionName = "shorts_posts";

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
  isCatPost = false,
  isShortsPost = false
) => {
  try {
    let collectionName = "posts";
    if (isDogPost) collectionName = "dog_posts";
    if (isCatPost) collectionName = "cat_posts";
    if (isShortsPost) collectionName = "shorts_posts";

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
