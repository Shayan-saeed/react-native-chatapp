import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
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
    timestamp: {
      fontSize: responsive.fontSize(12),
      color: theme.inputColor,
    },
  });
};
