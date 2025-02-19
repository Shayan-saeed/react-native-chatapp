import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "@/components/theme/ThemeContext";

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
      paddingHorizontal: 10,
      paddingVertical: 2,
      marginVertical: 10,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: wp("4.4%"),
      color: theme.textColor,
    },
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderBottomColor,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    chatTextContainer: {
      flex: 1,
    },
    chatName: {
      fontSize: wp("5%"),
      fontWeight: "bold",
      color: theme.textColor,
    },
    lastMessage: {
      fontSize: wp("3.9%"),
      color: theme.lastMessage,
    },
    timestampContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
    },
    timestamp: {
      fontSize: wp("3.3%"),
      color: theme.subheadingColor,
      marginTop: 10,
    },
    floatingButton: {
      position: "absolute",
      bottom: 80,
      right: 20,
      backgroundColor: "#1E90FF",
      width: 60,
      height: 60,
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
      paddingHorizontal: 6,
      paddingVertical: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    unreadText: {
      color: theme.textColor,
      fontSize: wp("3.3%"),
      fontWeight: "bold",
    },
    backdropStyle: {
      backgroundColor: theme.borderBottomColor,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    modalTitle: {
      fontSize: wp("5%"),
      fontWeight: "bold",
      color: theme.textColor,
      marginBottom: 20,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1E90FF",
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginBottom: 15,
      borderRadius: 10,
      width: "100%",
      gap: 10,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
      elevation: 5,
    },

    optionText: {
      color: "white",
      fontSize: wp("4.4%"),
      fontWeight: "500",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 10,
      overflow: "hidden",
      width: "75%",
    },
    modalHeader: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingVertical: 8,
      alignItems: "left",
      justifyContent: "center",
      paddingLeft: 10,
    },
    userName: {
      color: "white",
      fontSize: wp("5%"),
      fontWeight: "bold",
    },
    modalImage: {
      width: "100%",
      height: 275,
      resizeMode: "cover",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchContainerBG,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 20,
      width: "100%",
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: wp("4.4%"),
      color: theme.textColor,
    },
    button: {
      backgroundColor: "#1E90FF",
      paddingVertical: 12,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabled: {
      backgroundColor: "#555",
    },
    buttonText: {
      fontSize: wp("4.4%"),
      fontWeight: "bold",
      color: "white",
    },
  });
};
