import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      alignItems: "center",
      padding: 20,
    },
    backButton: {
      position: "absolute",
      top: 20,
      left: 20,
      padding: 10,
    },
    groupImage: {
      width: responsive.width(120),
      height: responsive.height(120),
      borderRadius: 60,
      marginTop: responsive.height(60),
      borderWidth: 2,
      borderColor: "#1E90FF",
    },
    userName: {
      fontSize: responsive.fontSize(20),
      fontWeight: "bold",
      color: theme.textColor,
      marginTop: responsive.height(15),
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: responsive.height(30),
      width: "80%",
    },
    actionButton: {
      alignItems: "center",
      backgroundColor: theme.borderBottomColor,
      paddingVertical: responsive.height(7),
      paddingHorizontal: responsive.width(10),
      borderRadius: 12,
      flexDirection: "row",
      gap: 5,
      marginRight: responsive.width(10),
    },
    actionText: {
      color: theme.textColor,
      fontSize: responsive.fontSize(16),
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchContainerBG,
      padding: 15,
      width: "100%",
      marginTop: responsive.height(15),
      borderRadius: 10,
      paddingLeft: responsive.width(20),
    },
    optionText: {
      color: theme.textColor,
      fontSize: responsive.fontSize(16),
      marginLeft: responsive.width(15),
    },
    groupMembersList: {
      marginTop: responsive.height(10),
      width: "100%",
      marginBottom: responsive.height(20),
    },
    groupMember: {
      color: "white",
      fontSize: responsive.fontSize(16),
      marginTop: responsive.height(5),
    },
    groupMembersList: {
      marginTop: responsive.height(10),
      width: "100%",
    },
    groupMemberItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    profileImage: {
      width: responsive.width(42),
      height: responsive.height(42),
      borderRadius: 20,
    },
  });
  
}