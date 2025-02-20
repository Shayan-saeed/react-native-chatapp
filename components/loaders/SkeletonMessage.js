import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";
import {useTheme} from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export default function SkeletonMessage({ isSender = false }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        isSender ? styles.senderContainer : styles.receiverContainer,
      ]}
    >
      <Skeleton
        width={responsive.width(82)} 
        height={responsive.height(22)}
        radius={10}
        colorMode={theme.colorMode}
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
    paddingHorizontal: responsive.width(12),
    paddingVertical: responsive.height(6),
    borderTopRightRadius: 0,
    color: "#333",
  },
  receiverContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: responsive.width(12),
    paddingVertical: responsive.height(6),
    borderTopLeftRadius: 0,
    color: "#333",
  },
});
