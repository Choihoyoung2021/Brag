// MainTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import ShortsScreen from "./ShortsScreen";
import ShortsproduceScreen from "./ShortsproduceScreen";
import ProfilesScreen from "./ProfilesScreen";
import ChatRoomsScreen from "./ChattingRoomScreen";
import ChattingScreen from "./ChattingScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // 홈 아이콘
import AntDesign from "@expo/vector-icons/AntDesign"; // 쇼츠 아이콘
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"; // 채팅 아이콘
import Octicons from "@expo/vector-icons/Octicons"; // 프로필 아이콘

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ChatStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="ChatRoomsScreen" component={ChatRoomsScreen} />
    <Stack.Screen name="ChattingScreen" component={ChattingScreen} />
  </Stack.Navigator>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "gray",
        tabBarInactiveTintColor: "black",
        tabBarStyle: {
          display: "flex",
        },
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="쇼츠"
        component={ShortsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="play" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="쇼츠제작"
        component={ShortsproduceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="채팅"
        component={ChatStack}
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
        name="프로필"
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
