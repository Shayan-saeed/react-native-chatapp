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
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: responsive.height(15),
      paddingHorizontal: responsive.width(20),
      backgroundColor: "#1E90FF",
    },
    headerTitle: {
      fontSize: responsive.fontSize(18),
      fontWeight: "bold",
      color: "white",
    },
    profilePicContainer: {
      marginTop: responsive.height(30),
      position: "relative",
    },
    profilePic: {
      width: responsive.width(120),
      height: responsive.height(120),
      borderRadius: 60,
      borderWidth: 3,
      borderColor: "white",
    },
    cameraIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#1E90FF",
      borderRadius: 15,
      padding: 5,
    },
    detailsContainer: {
      width: "90%",
      marginTop: responsive.height(40),
      backgroundColor: theme.searchContainerBG,
      padding: 15,
      borderRadius: 10,
    },
    detailItem: {
      marginBottom: responsive.height(15),
    },
    label: {
      ffontSize: responsive.fontSize(14),
      color: "#888",
    },
    value: {
      fontSize: responsive.fontSize(18),
      color: theme.textColor,
      fontWeight: "bold",
    },
    input: {
      fontSize: responsive.fontSize(18),
      color: theme.textColor,
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderBottomColor: "gray",
      paddingVertical: responsive.height(5),
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.borderBottomColor,
      borderColor: "#1E90FF",
      borderWidth: 1,
      padding: 12,
      borderRadius: 30,
      marginTop: responsive.height(30),
      width: "80%",
      justifyContent: "center",
    },
    logoutText: {
      fontSize: responsive.fontSize(16),
      color: theme.textColor,
      marginLeft: responsive.width(10),
    },
  });
};
