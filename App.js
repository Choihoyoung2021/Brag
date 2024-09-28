// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabs from "./src/screens/MainTabs";
import Announcement from "./src/screens/category/Announcement";
import Calender from "./src/screens/category/Calender";
import PopularPosts from "./src/screens/category/PopularPosts";
import AllPosts from "./src/screens/category/AllPosts";
import PetPost from "./src/screens/category/PetPost";
import TipPosts from "./src/screens/category/TipPosts";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignUpScreen } from "./src/screens/SignUpScreen";
import AddPostScreen from "./src/screens/category/writingScreen/AddPostScreen";
import { signUpUser } from "./src/firebase/signUpLogic"; // 회원가입 로직 추가
import { SelectLoginScreen } from "./src/screens/SelectLoginScreen"; // 로그인 선택 화면 추가
import LoginInputScreen from "./src/screens/LoginInputScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen"; // PostDetailScreen 추가

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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Announcement"
          component={Announcement}
          options={{ title: "공지사항" }}
        />
        <Stack.Screen
          name="Calender"
          component={Calender}
          options={{ title: "캘린더" }}
        />
        <Stack.Screen
          name="PopularPosts"
          component={PopularPosts}
          options={{ title: "인기글" }}
        />
        <Stack.Screen
          name="AllPosts"
          component={AllPosts}
          options={{ title: "전체글보기" }}
        />
        <Stack.Screen
          name="PetPost"
          component={PetPost}
          options={{ title: "강아지/고양이게시판" }}
        />
        <Stack.Screen
          name="TipPosts"
          component={TipPosts}
          options={{ title: "나만의 사육TIP" }}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPostScreen}
          options={{ title: "글쓰기" }}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen} // PostDetailScreen 추가
          options={{ title: "게시물 상세보기" }} // 제목 설정
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
