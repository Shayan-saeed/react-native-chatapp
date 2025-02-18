import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";

export default function SkeletonMessage({ isSender = false }) {
  return (
    <View
      style={[
        styles.container,
        isSender ? styles.senderContainer : styles.receiverContainer,
      ]}
    >
      <Skeleton
        width={150 + Math.random() * 50} 
        height={20}
        radius={10}
        colorMode="dark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
  },
  senderContainer: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 0,
    color: "#333",
  },
  receiverContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 0,
    color: "#333",
  },
});
