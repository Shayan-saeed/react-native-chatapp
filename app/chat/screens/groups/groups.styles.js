import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from "@/components/theme/ThemeContext";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: theme.backgroundColor,
    },
    username: {
      fontSize: wp("5.5%"),
      fontWeight: "bold",
      color: theme.textColor,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderBottomColor,
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
      backgroundColor: theme.borderBottomColor,
      marginBottom: 10,
      borderRadius: 10,
      padding: 15,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
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
    heading: {
      fontSize: wp("6%"),
      fontWeight: "bold",
      color: theme.textColor,
      marginBottom: 20,
    },
    input: {
      backgroundColor: theme.searchContainerBG,
      borderRadius: 10,
      padding: 12,
      marginBottom: 20,
      width: "100%",
      color: theme.textColor,
    },
    userItem: {
      padding: 12,
      marginBottom: 5,
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
    backdropStyle: {
      backgroundColor: theme.borderBottomColor,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 20,
      paddingVertical: 20,
      height: "80%",
    },
  });
}
