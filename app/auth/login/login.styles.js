import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 20,
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
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: wp("4.4%"),
    color: "#333",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    color: "#555",
    fontSize: wp("4.4%"),
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: wp("4.4%"),
    color: "#333",
  },
});
