import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    width: "75%",
  },
  modalHeader: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 8,
    alignItems: "left",
    justifyContent: "center",
    paddingLeft: 10,
  },
  modalImage: {
    width: "100%",
    height: 275,
    resizeMode: "cover",
  },
  iconsRow: {
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 15,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    color: "white",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
});
