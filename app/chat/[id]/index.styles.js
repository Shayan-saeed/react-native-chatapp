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
  });
};
