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
      flexDirection: "column",
    },
    screenText: {
      color: theme.textColor,
      fontSize: responsive.fontSize(18),
    },
    addStatusContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 25,
    },
    addStatusView: {
      flexDirection: "column",
    },
    heading: {
      color: "white",
      fontSize: 16,
      fontWeight: 700,
    },
    text: {
      color: theme.borderColor,
    },
    profileImage: {
      width: 50,
      height: responsive.height(52),
      borderRadius: 25,
      borderWidth: 2,
      borderColor: "#1E90FF",
      marginRight: responsive.width(12),
    },
    recentUpdatesHeader: {
      color: theme.textColor,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    statusItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    statusProfileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: "#1E90FF",
      marginRight: 10,
    },
    statusTextContainer: {
      flexDirection: "column",
    },
    statusName: {
      color: theme.textColor,
      fontSize: 16,
    },
    statusTime: {
      color: theme.borderColor,
      fontSize: 14,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "black",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
    },
    backButton: {
      padding: 5,
    },
    userInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    modalProfileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    modalName: {
      color: "white",
      fontSize: 16,
    },
    modalTime: {
      color: theme.borderColor,
      fontSize: 14,
    },
    infoButton: {
      padding: 5,
    },
    fullScreenImage: {
      flex: 1,
      resizeMode: "contain",
    },
    progressBar: {
      height: 3,
      backgroundColor: "#1E90FF",
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
    menuOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    menuContainer: {
      backgroundColor: "white",
      padding: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    menuItem: {
      padding: 15,
      alignItems: "center",
    },
    menuText: {
      fontSize: 16,
      color: "black",
    },
  });
};
