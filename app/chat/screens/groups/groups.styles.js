import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: theme.backgroundColor,
    },
    username: {
      fontSize: responsive.fontSize(20),
      fontWeight: "bold",
      color: theme.textColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: responsive.height(10),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderBottomColor,
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
      backgroundColor: theme.borderBottomColor,
      marginBottom: responsive.height(10),
      borderRadius: 10,
      padding: 15,
    },
    chatTextContainer: {
      flex: 1,
    },
    chatName: {
      color: theme.textColor,
      fontWeight: "bold",
    },
    lastMessage: {
      color: theme.lastMessage,
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
    heading: {
      fontSize: responsive.fontSize(22),
      fontWeight: "bold",
      color: theme.textColor,
      marginBottom: responsive.height(20),
      alignSelf: "center",
    },
    input: {
      backgroundColor: theme.searchContainerBG,
      borderRadius: 10,
      padding: 12,
      marginBottom: responsive.height(20),
      width: "100%",
      color: theme.textColor,
    },
    userItem: {
      padding: 12,
      marginBottom: responsive.height(5),
      backgroundColor: theme.borderBottomColor,
      borderRadius: 10,
      width: "100%",
    },
    selectedUser: {
      backgroundColor: "#1E90FF",
    },
    userText: {
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
    backdropStyle: {
      backgroundColor: theme.borderBottomColor,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: responsive.width(20),
      paddingVertical: responsive.height(20),
      height: "80%",
    },
    dragIndicator: {
      width: 40,
      height: 5,
      backgroundColor: "gray",
      borderRadius: 10,
      marginBottom: 10,
      alignSelf: "center"
    },
  });
}
