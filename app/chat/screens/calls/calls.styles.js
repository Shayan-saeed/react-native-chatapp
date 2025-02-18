import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#121212",
    },
    screenText: {
      color: "white",
      fontSize: wp("5%"),
    },
  });
  