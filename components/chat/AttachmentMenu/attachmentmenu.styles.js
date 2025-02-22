import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
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
    
  });
};
