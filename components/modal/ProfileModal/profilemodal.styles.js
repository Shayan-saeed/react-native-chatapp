import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
      backgroundColor: theme.textColor,
      borderRadius: 10,
      overflow: "hidden",
      width: "75%",
    },
    modalHeader: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingVertical: responsive.height(8),
      alignItems: "left",
      justifyContent: "center",
      paddingLeft: responsive.width(10),
    },
    modalImage: {
      width: "100%",
      height: responsive.height(277),
      resizeMode: "cover",
    },
    iconsRow: {
      flexDirection: "row",
      backgroundColor: theme.backgroundColor,
      justifyContent: "space-around",
      paddingVertical: responsive.height(12),
    },
    iconButton: {
      justifyContent: "center",
      alignItems: "center",
    },
    userName: {
      color: "white",
      fontSize: responsive.fontSize(18),
      fontWeight: "bold",
    },
  });
}
