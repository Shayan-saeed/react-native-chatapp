import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "@/components/theme/ThemeContext";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: 15,
      paddingHorizontal: 20,
      backgroundColor: "#1E90FF",
    },
    headerTitle: {
      fontSize: wp("5%"),
      fontWeight: "bold",
      color: "white",
    },
    profilePicContainer: {
      marginTop: 30,
      position: "relative",
    },
    profilePic: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: "white",
    },
    cameraIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#1E90FF",
      borderRadius: 15,
      padding: 5,
    },
    detailsContainer: {
      width: "90%",
      marginTop: 40,
      backgroundColor: theme.searchContainerBG,
      padding: 15,
      borderRadius: 10,
    },
    detailItem: {
      marginBottom: 15,
    },
    label: {
      ffontSize: wp("3.9%"),
      color: "#888",
    },
    value: {
      fontSize: wp("5%"),
      color: theme.textColor,
      fontWeight: "bold",
    },
    input: {
      fontSize: wp("5%"),
      color: theme.textColor,
      fontWeight: "bold",
      borderBottomWidth: 1,
      borderBottomColor: "gray",
      paddingVertical: 5,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.borderBottomColor,
      borderColor: "#1E90FF",
      borderWidth: 1,
      padding: 12,
      borderRadius: 30,
      marginTop: 30,
      width: "80%",
      justifyContent: "center",
    },
    logoutText: {
      fontSize: wp("4.4%"),
      color: theme.textColor,
      marginLeft: 10,
    },
  });
};
