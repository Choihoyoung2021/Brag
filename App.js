// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabs from "./src/screens/MainTabs";
import Announcement from "./src/screens/category/Announcement";
import Calender from "./src/screens/category/Calender";
import FreePosts from "./src/screens/category/FreePosts";
import TipPosts from "./src/screens/category/TipPosts";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignUpScreen } from "./src/screens/SignUpScreen";
import AddPostScreen from "./src/screens/category/writingScreen/AddPostScreen";
import { signUpUser } from "./src/firebase/signUpLogic"; // 회원가입 로직 추가
import { SelectLoginScreen } from "./src/screens/SelectLoginScreen"; // 로그인 선택 화면 추가
import LoginInputScreen from "./src/screens/LoginInputScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen"; // PostDetailScreen 추가
import CatPost from "./src/screens/category/CatPost"; // CatPost 추가
import DogPost from "./src/screens/category/DogPost";
import CatPhotoScreen from "./src/screens/CatPhotoScreen";
import DogPhotoScreen from "./src/screens/DogPhotoScreen";
import PhotoAddScreen from "./src/screens/category/writingScreen/PhotoAddScreen";
import RangKing1Screen from "./src/screens/RanKing1Screen";
import RangKing2Screen from "./src/screens/RanKing2Screen";
import RangKing3Screen from "./src/screens/RanKing3Screen";
import ShortsproduceScreen from "./src/screens/ShortsproduceScreen";
import ShortsPlayer from "./src/screens/ShortsPlayer";

const Stack = createStackNavigator();

export default function App() {
  const handleSignUp = async (userData, navigation) => {
    try {
      await signUpUser(userData);
      console.log("회원가입 성공:", userData);
      navigation.navigate("MainTabs"); // 회원가입 성공 시 MainTabs로 이동
    } catch (error) {
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // 헤더 숨기기
        />
        <Stack.Screen
          name="SelectLogin"
          component={SelectLoginScreen}
          options={{ headerShown: false }} // 헤더 숨기기
        />
        <Stack.Screen
          name="LoginInput"
          component={LoginInputScreen}
          options={{ title: "로그인" }} // 로그인 스크린 제목
        />
        <Stack.Screen name="SignUp" options={{ title: "회원가입" }}>
          {({ navigation }) => (
            <SignUpScreen onSignUp={(data) => handleSignUp(data, navigation)} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Announcement"
          component={Announcement}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calender"
          component={Calender}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FreePosts"
          component={FreePosts}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TipPosts"
          component={TipPosts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen} // PostDetailScreen 추가
          options={{ headerShown: false }} // 제목 설정
        />
        <Stack.Screen
          name="CatPost"
          component={CatPost}
          options={{ headerShown: false }} // CatPost 스크린 추가
        />
        <Stack.Screen
          name="DogPost"
          component={DogPost}
          options={{ headerShown: false }} // DogPost 스크린 추가
        />
        <Stack.Screen
          name="DogPhoto"
          component={DogPhotoScreen}
          options={{ headerShown: false }} // DogPost 스크린 추가
        />
        <Stack.Screen
          name="CatPhoto"
          component={CatPhotoScreen}
          options={{ headerShown: false }} // DogPost 스크린 추가
        />
        <Stack.Screen
          name="PhotoAddScreen"
          component={PhotoAddScreen}
          options={{ headerShown: false }} // DogPost 스크린 추가
        />

        <Stack.Screen
          name="RangKing1Screen"
          component={RangKing1Screen}
          options={{ headerShown: false }} // DogPost 스크린 추가
        />
        <Stack.Screen
          name="RangKing2Screen"
          component={RangKing2Screen}
          options={{ headerShown: false }} // DogPost 스크린 추가
        />
        <Stack.Screen
          name="RangKing3Screen"
          component={RangKing3Screen}
          options={{ headerShown: false }} // DogPost 스크린 추가
        />
        <Stack.Screen
          name="ShortsproduceScreen"
          component={ShortsproduceScreen}
          options={{ title: "쇼츠 제작" }}
        />
        <Stack.Screen
          name="ShortsPlayer"
          component={ShortsPlayer}
          options={{ title: "쇼츠 재생" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
