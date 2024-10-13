import { db } from "./FirebaseConfig";
import { collection, getDocs } from "firebase/firestore"; // Firestore 관련 함수 import

export const getTopPostImages = async () => {
  const posts = [];

  // Firestore에서 DogPosts와 CatPosts 게시물 가져오기
  const dogPostsSnapshot = await getDocs(collection(db, "dog_posts"));
  const catPostsSnapshot = await getDocs(collection(db, "cat_posts"));

  // 각 게시물에서 URL을 가져오기
  dogPostsSnapshot.forEach((doc) => {
    const postData = doc.data();
    if (postData.imageUrls && postData.imageUrls.length > 0) {
      posts.push({
        id: doc.id,
        collection: "dog_posts",
        ...postData,
        imageUri: postData.imageUrls[0],
      });
    }
  });

  catPostsSnapshot.forEach((doc) => {
    const postData = doc.data();
    if (postData.imageUrls && postData.imageUrls.length > 0) {
      posts.push({
        id: doc.id,
        collection: "cat_posts",
        ...postData,
        imageUri: postData.imageUrls[0],
      });
    }
  });

  // 좋아요 수 기준으로 정렬
  const sortedPosts = posts.sort((a, b) => b.likes.length - a.likes.length);

  // 상위 3개의 게시물 반환
  return sortedPosts.slice(0, 3);
};
