// ShortsPlayer.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Video } from "expo-av";

const { width, height } = Dimensions.get("window");

const ShortsPlayer = ({ route }) => {
  const { videoUrl } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width,
    height: height,
  },
});

export default ShortsPlayer;
