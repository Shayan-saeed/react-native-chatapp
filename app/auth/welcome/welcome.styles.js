import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {

  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.backgroundColor,
      justifyContent: "center",
      padding: 20,
    },
    image: {
      width: responsive.width(155),
      height: responsive.height(150),
      marginBottom: responsive.height(20),
      tintColor: "#1E90FF",
    },
    heading: {
      fontSize: responsive.fontSize(28),
      fontWeight: "bold",
      color: "#1E90FF",
      textAlign: "center",
      marginBottom: responsive.height(10),
    },
    subHeading: {
      fontSize: responsive.fontSize(16),
      color: theme.subheadingColor,
      textAlign: "center",
      marginBottom: responsive.height(30),
    },
    signUpButton: {
      backgroundColor: "#1E90FF",
      paddingVertical: responsive.height(14),
      paddingHorizontal: responsive.width(80),
      borderRadius: 10,
      elevation: 6,
      shadowColor: "#1E90FF",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      marginBottom: responsive.height(15),
    },
    buttonText: {
      color: "white",
      fontSize: responsive.fontSize(18),
      fontWeight: "bold",
    },
    signInButton: {
      backgroundColor: theme.backgroundColor,
      paddingVertical: responsive.height(14),
      paddingHorizontal: responsive.width(80),
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#1E90FF",
      elevation: 6,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
    },
    signInText: {
      color: "#1E90FF",
      fontSize: responsive.fontSize(18),
      fontWeight: "bold",
    },
  });

}