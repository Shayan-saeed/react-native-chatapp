import { StyleSheet } from "react-native";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      justifyContent: "center",
      padding: 20,
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
    input: {
      height: responsive.height(50),
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: responsive.width(15),
      marginBottom: responsive.height(20),
      fontSize: responsive.fontSize(16),
      color: theme.inputColor,
    },
    button: {
      backgroundColor: "#1E90FF",
      paddingVertical: responsive.height(15),
      borderRadius: 8,
      alignItems: "center",
      marginBottom: responsive.height(20),
    },
    buttonText: {
      color: "white",
      fontSize: responsive.fontSize(18),
      fontWeight: "bold",
    },
    linkText: {
      textAlign: "center",
      color: theme.subheadingColor,
      fontSize: responsive.fontSize(16),
    },
    link: {
      color: "#1E90FF",
      fontWeight: "bold",
    },
    buttonDisabled: {
      backgroundColor: "#555",
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: responsive.width(15),
      marginBottom: responsive.height(20),
    },
    passwordInput: {
      flex: 1,
      height: responsive.height(50),
      fontSize: responsive.fontSize(16),
      color: theme.inputColor,
    },
  });
};
