import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: responsive.height(12),
      paddingHorizontal: responsive.width(10),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderBottomColor,
    },
    profileImage: {
      width: 50,
      height: responsive.height(52),
      borderRadius: 25,
      marginRight: responsive.width(12),
    },
    chatTextContainer: {
      flex: 1,
    },
    chatName: {
      fontSize: responsive.fontSize(18),
      fontWeight: "bold",
      color: theme.textColor,
    },
    lastMessage: {
      fontSize: responsive.fontSize(14),
      color: "#888",
    },
    timestampContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
    },
    timestamp: {
      fontSize: responsive.fontSize(12),
      color: theme.lastMessage,
      marginTop: responsive.height(10),
    },
    timestampContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
    },
    unreadBadge: {
      backgroundColor: "red",
      borderRadius: 12,
      paddingHorizontal: responsive.width(6),
      paddingVertical: responsive.height(2),
      alignItems: "center",
      justifyContent: "center",
    },
    unreadText: {
      color: "white",
      fontSize: responsive.fontSize(12),
      fontWeight: "bold",
    },
  });
};
