import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";

import {useTheme} from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";
export default function ChatListLoader() {

  const theme = useTheme();

  return (
    <View style={[styles.chatItem, {borderBottomColor: theme.borderBottomColor,}]}>
      <Skeleton width={50} height={responsive.height(52)} radius="round" colorMode={theme.colorMode} />
      <View style={styles.chatTextContainer}>
        <Skeleton width={"60%"} height={20} radius={5} colorMode={theme.colorMode} />
        <Skeleton
          width={"80%"}
          height={responsive.height(17)}
          radius={5}
          style={{ marginTop: responsive.height(5) }}
          colorMode={theme.colorMode}
        />
      </View>
      <Skeleton width={40} height={responsive.height(13)} radius={5} colorMode={theme.colorMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsive.height(12),
    paddingHorizontal: responsive.width(10),
    borderBottomWidth: 1,
  },
  chatTextContainer: {
    flex: 1,
    marginLeft: responsive.width(12),
    gap: 4,
  },
});
