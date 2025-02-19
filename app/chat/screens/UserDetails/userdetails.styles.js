import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from "@/components/theme/ThemeContext";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      alignItems: "center",
      padding: 20,
    },
    backButton: {
      position: "absolute",
      top: 20,
      left: 20,
      padding: 10,
    },
    groupImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginTop: 60,
      borderWidth: 2,
      borderColor: "#1E90FF",
    },
    userName: {
      fontSize: wp("5.5%"),
      fontWeight: "bold",
      color: theme.textColor,
      marginTop: 15,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 30,
      width: "80%",
    },
    actionButton: {
      alignItems: "center",
      backgroundColor: theme.borderBottomColor,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 12,
      flexDirection: "row",
      gap: 5,
      marginRight: 10,
    },
    actionText: {
      color: theme.textColor,
      fontSize: wp("4.4%"),
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.searchContainerBG,
      padding: 15,
      width: "100%",
      marginTop: 15,
      borderRadius: 10,
      paddingLeft: 20,
    },
    optionText: {
      color: theme.textColor,
      fontSize: wp("4.4%"),
      marginLeft: 15,
    },
    groupMembersList: {
      marginTop: 10,
      width: "100%",
      marginBottom: 20,
    },
    groupMember: {
      color: "white",
      fontSize: wp("4.4%"),
      marginTop: 5,
    },
    groupMembersList: {
      marginTop: 10,
      width: "100%",
    },
    groupMemberItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  });
  
}