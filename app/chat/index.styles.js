import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {

  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: 15,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchContainerBG,
      borderRadius: 20,
      paddingHorizontal: responsive.width(10),
      paddingVertical: responsive.height(2),
      marginVertical: responsive.height(10),
    },
    searchIcon: {
      marginRight: responsive.width(8),
    },
    searchInput: {
      flex: 1,
      fontSize: responsive.fontSize(16),
      color: theme.textColor,
    },
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: responsive.height(12),
      paddingHorizontal: responsive.width(10),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderBottomColor,
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
      color: theme.lastMessage,
    },
    timestampContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
    },
    timestamp: {
      fontSize: responsive.fontSize(12),
      color: theme.subheadingColor,
      marginTop: responsive.height(10),
    },
    floatingButton: {
      position: "absolute",
      bottom: 80,
      right: 20,
      backgroundColor: "#1E90FF",
      width: responsive.width(60),
      height: responsive.height(60),
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 3,
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
      color: theme.textColor,
      fontSize: responsive.fontSize(12),
      fontWeight: "bold",
    },
    backdropStyle: {
      backgroundColor: theme.borderBottomColor,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: responsive.width(20),
      paddingVertical: responsive.height(20),
    },
    modalTitle: {
      fontSize: responsive.fontSize(18),
      fontWeight: "bold",
      color: theme.textColor,
      marginBottom: responsive.height(20),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchContainerBG,
      borderRadius: 10,
      paddingHorizontal: responsive.width(12),
      paddingVertical: responsive.height(10),
      marginBottom: responsive.height(20),
      width: "100%",
    },
    icon: {
      marginRight: responsive.width(8),
    },
    input: {
      flex: 1,
      fontSize: responsive.fontSize(16),
      color: theme.textColor,
    },
    button: {
      backgroundColor: "#1E90FF",
      paddingVertical: responsive.height(12),
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabled: {
      backgroundColor: "#555",
    },
    buttonText: {
      fontSize: responsive.fontSize(16),
      fontWeight: "bold",
      color: "white",
    },
  });
};
