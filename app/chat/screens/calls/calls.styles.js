import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from "@/components/theme/ThemeContext";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundColor,
    },
    screenText: {
      color: theme.textColor,
      fontSize: wp("5%"),
    },
  });
}
  