import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#121212",
  },
  username: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: wp("4.4%"),
    color: "white",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatName: {
    color: "white",
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#888",
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#1E90FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },
  heading: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    width: "100%",
    color: "white",
  },
  userItem: {
    padding: 12,
    marginBottom: 5,
    backgroundColor: "#333",
    borderRadius: 10,
    width: "100%",
  },
  selectedUser: {
    backgroundColor: "#1E90FF",
  },
  userText: {
    color: "white",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    fontSize: wp("4.4%"),
    fontWeight: "bold",
    color: "white",
  },
  backdropStyle: {
    backgroundColor: "#333",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: "80%",
  },
});
