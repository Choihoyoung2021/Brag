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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
