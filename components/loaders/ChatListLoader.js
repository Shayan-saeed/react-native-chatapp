import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {useTheme} from "@/components/theme/ThemeContext";
export default function ChatListLoader() {

  const theme = useTheme();

  return (
    <View style={[styles.chatItem, {borderBottomColor: theme.borderBottomColor,}]}>
      <Skeleton width={50} height={50} radius="round" colorMode={theme.colorMode} />
      <View style={styles.chatTextContainer}>
        <Skeleton width={"60%"} height={20} radius={5} colorMode={theme.colorMode} />
        <Skeleton
          width={"80%"}
          height={16}
          radius={5}
          style={{ marginTop: 5 }}
          colorMode={theme.colorMode}
        />
      </View>
      <Skeleton width={40} height={12} radius={5} colorMode={theme.colorMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  chatTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
});
