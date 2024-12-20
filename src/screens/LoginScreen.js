// LoginScreen.js
import React, { useRef, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Spacer } from "../components/spacer";

export const LoginScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, slideAnim]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={{ backgroundColor: "#ffffff" }}>
          <Spacer space={60} />
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>안녕하세요 :)</Text>
            <Text style={styles.title}>Brag 입니다.</Text>
          </Animated.View>
          <Spacer space={20} />
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim,
            }}
          >
            <Text
              style={{
                fontSize: 23,
                paddingLeft: 15,
                color: "#BDBDBD",
                fontWeight: "bold",
              }}
            >
              자신의 반려동물을 자랑해 보세요!
            </Text>
          </Animated.View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={require("../../assets/dog.png")}
            style={{ top: "-10%", width: "100%", height: "60%" }}
          />
          <View style={styles.line} />
          <Text style={styles.lineText}>SNS 계정으로 로그인</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: -70,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
            <Image
              source={require("../../assets/kakao.png")}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/naver.png")}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/apple.png")}
              style={{ borderRadius: 20, width: 50, height: 50 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/google.png")}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        </View>

        {/* 앱 로그인 버튼 추가 */}
        <TouchableOpacity
          style={styles.appLoginButton}
          onPress={() => navigation.navigate("SelectLogin")} // 로그인 선택 화면으로 이동
        >
          <Text style={styles.appLoginText}>앱 로그인</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 35,
    fontWeight: "bold",
    paddingLeft: 15,
  },
  line: {
    position: "absolute",
    top: "78%",
    width: "100%",
    height: 2,
    backgroundColor: "#BDBDBD",
  },
  lineText: {
    marginTop: 0,
    position: "absolute",
    top: "76%",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#BDBDBD",
    fontWeight: "bold",
  },
  appLoginButton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 50,
  },
  appLoginText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
