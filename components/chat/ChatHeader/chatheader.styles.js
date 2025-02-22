import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
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
  });
};
