import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatName: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "white",
  },
  lastMessage: {
    fontSize: wp("3.9%"),
    color: "#888",
  },
  timestampContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  timestamp: {
    fontSize: wp("3.3%"),
    color: "#aaa",
    marginTop: 10,
  },
  timestampContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "white",
    fontSize: wp("3.3%"),
    fontWeight: "bold",
  },
});
