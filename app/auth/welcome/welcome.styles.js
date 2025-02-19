import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from "@/components/theme/ThemeContext";

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
      width: wp("42%"),
      height: hp("19%"),
      marginBottom: hp("2.5%"),
      tintColor: "#1E90FF",
    },
    heading: {
      fontSize: wp("7.7%"),
      fontWeight: "bold",
      color: "#1E90FF",
      textAlign: "center",
      marginBottom: 10,
    },
    subHeading: {
      fontSize: wp("4.4%"),
      color: theme.subheadingColor,
      textAlign: "center",
      marginBottom: 30,
    },
    signUpButton: {
      backgroundColor: "#1E90FF",
      paddingVertical: 14,
      paddingHorizontal: 80,
      borderRadius: 10,
      elevation: 6,
      shadowColor: "#1E90FF",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      marginBottom: 15,
    },
    buttonText: {
      color: "white",
      fontSize: wp("5%"),
      fontWeight: "bold",
    },
    signInButton: {
      backgroundColor: theme.backgroundColor,
      paddingVertical: 14,
      paddingHorizontal: 80,
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
      fontSize: wp("5%"),
      fontWeight: "bold",
    },
  });

}