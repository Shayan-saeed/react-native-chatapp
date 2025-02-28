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
      justifyContent: "space-around",
      marginTop: responsive.height(30),
      width: "90%", 
      alignSelf: "center", 
      gap: 3,
    },
    actionButton: {
      alignItems: "center",
      backgroundColor: theme.borderBottomColor,
      paddingVertical: responsive.height(15), 
      borderRadius: 12,
      flexDirection: "column", 
      justifyContent: "center",
      width: responsive.width(50), 
      height: responsive.width(50), 
      flex: 1, 
      marginHorizontal: responsive.width(2), 
    },
    actionText: {
      marginTop: responsive.height(1),
      textAlign: 'center',
      color: theme.textColor,
      fontSize: responsive.fontSize(13),
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
      marginTop: responsive.height(2),
      width: "100%",
    },
    groupMemberItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
    },
    profileImage: {
      width: responsive.width(42),
      height: responsive.height(42),
      borderRadius: 20,
    },
    editIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#1E90FF",
      borderRadius: 15,
      padding: 5,
    },
    addButton: {
      backgroundColor: "#007AFF",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginVertical: 10,
      alignSelf: "center",
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      marginLeft: 5,
    },
    adminBadge: {
      backgroundColor: "gold",
      color: "#000",
      fontSize: 12,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginLeft: 8,
    },
  });
};
