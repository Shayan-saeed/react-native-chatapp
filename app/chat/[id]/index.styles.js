import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

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
      paddingVertical: responsive.height(12),
      paddingHorizontal: responsive.width(16),
      backgroundColor: theme.backgroundColor,
    },
    userName: {
      flex: 1,
      fontSize: responsive.fontSize(16),
      fontWeight: "bold",
      color: theme.textColor,
    },
    timestamp: {
      fontSize: responsive.fontSize(12),
      color: theme.inputColor,
    },
    sentMessage: (isUrl) => ({
      alignSelf: "flex-end",
      backgroundColor: "#1E90FF",
      padding: isUrl ? 2 : 5,
      paddingInline: isUrl ? 2 : 10,
      borderRadius: 10,
      borderTopRightRadius: 20,
      marginVertical: responsive.height(10),
      marginRight: responsive.width(10),
      maxWidth: "70%",
    }),
    receivedMessage: (isUrl) => ({
      alignSelf: "flex-start",
      backgroundColor: theme.recievedMessageBG,
      padding: isUrl ? 2 : 5,
      paddingInline: isUrl ? 2 : 10,
      borderRadius: 10,
      borderTopLeftRadius: 20,
      marginVertical: responsive.height(5),
      marginLeft: responsive.width(10),
      maxWidth: "70%",
    }),
    messageText: {
      fontSize: responsive.fontSize(14),
      color: "white",
      marginBottom: responsive.height(2),
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchContainerBG,
      borderRadius: 30,
      paddingVertical: responsive.height(10),
      paddingHorizontal: responsive.width(15),
      margin: 10,
    },
    input: {
      flex: 1,
      fontSize: responsive.fontSize(16),
      color: theme.textColor,
      paddingHorizontal: responsive.width(10),
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
      marginBottom: responsive.height(10),
    },
    attachmentOption: {
      alignItems: "center",
      marginHorizontal: responsive.width(15),
    },
    iconBox: {
      backgroundColor: "#1E90FF",
      padding: 10,
      borderRadius: 15,
    },
    attachmentText: {
      marginTop: responsive.height(5),
      fontSize: responsive.fontSize(14),
      color: theme.textColor,
    },
    recordIconContainer: {
      marginRight: responsive.width(10),
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
      width: responsive.width(200),
      paddingVertical: responsive.height(5),
      zIndex: 1,
    },
    menuItem: {
      paddingVertical: responsive.height(10),
      paddingHorizontal: responsive.width(15),
    },
    menuText: {
      color: theme.textColor,
      fontSize: responsive.fontSize(16),
    },
    groupMessageSender: {},
    groupMessageReceiver: {},
  });
};
