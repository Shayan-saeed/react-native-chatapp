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
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.backgroundColor,
    },
    profilePic: {
      width: 35,
      height: 35,
      borderRadius: 20,
      marginHorizontal: 10,
    },
    userName: {
      flex: 1,
      fontSize: wp("4.4%"),
      fontWeight: "bold",
      color: theme.textColor,
    },
    timestamp: {
      fontSize: wp("3.3%"),
      color: theme.inputColor,
    },
    sentMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#1E90FF",
      padding: 8,
      paddingInline: 10,
      borderRadius: 10,
      borderTopRightRadius: 20,
      marginVertical: 5,
      marginRight: 10,
      maxWidth: "70%",
    },
    receivedMessage: {
      alignSelf: "flex-start",
      backgroundColor: theme.recievedMessageBG,
      padding: 10,
      borderRadius: 10,
      borderTopLeftRadius: 20,
      marginVertical: 5,
      marginLeft: 10,
      maxWidth: "70%",
    },
    messageText: {
      fontSize: wp("3.9%"),
      color: "white",
      marginBottom: 2,
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchContainerBG,
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 15,
      margin: 10,
    },
    input: {
      flex: 1,
      fontSize: wp("4.4%"),
      color: theme.textColor,
      paddingHorizontal: 10,
    },
    attachmentMenu: {
      backgroundColor: theme.searchContainerBG,
      padding: 10,
      borderRadius: 10,
      position: "absolute",
      bottom: 65,
      alignSelf: "center",
    },
    attachmentRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginBottom: 10,
    },
    attachmentOption: {
      alignItems: "center",
      marginHorizontal: 15,
    },
    iconBox: {
      backgroundColor: "#1E90FF",
      padding: 10,
      borderRadius: 15,
    },
    attachmentText: {
      marginTop: 5,
      fontSize: wp("3.9%"),
      color: theme.textColor,
    },
    recordIconContainer: {
      marginRight: 10,
    },
    recordIcon: {
      backgroundColor: "#1E90FF",
      borderRadius: 30,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    menu: {
      position: "absolute",
      right: 0,
      top: 40,
      backgroundColor: theme.borderBottomColor,
      borderRadius: 8,
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      width: 200,
      paddingVertical: 5,
      zIndex: 1,
    },
    menuItem: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    menuText: {
      color: theme.textColor,
      fontSize: wp("4.4%"),
    },
    groupMessageSender:{

    },
    groupMessageReceiver: {
      
    }
  });
};
