//MainTabs.js 파일

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChattingScreen from "./ChattingScreen";
import HomeScreen from "./HomeScreen";
import ShortsScreen from "./ShortsScreen";
import ShortsproduceScreen from "./ShortsproduceScreen";
import ProfilesScreen from "./ProfilesScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // 홈 아이콘
import AntDesign from "@expo/vector-icons/AntDesign"; // 쇼츠 아이콘
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; // 채팅 아이콘
import Octicons from "@expo/vector-icons/Octicons"; // 프로필 아이콘

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 헤더 없애기
        tabBarActiveTintColor: "gray", // 선택된 탭의 아이콘 색상
        tabBarInactiveTintColor: "black", // 선택되지 않은 탭의 아이콘 색상
        tabBarStyle: {
          display: "flex", // 탭 바 항상 보이도록 설정
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Shorts"
        component={ShortsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="play" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Shortsproduce"
        component={ShortsproduceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Chatting"
        component={ChattingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat-processing"
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profiles"
        component={ProfilesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person-fill" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs;
