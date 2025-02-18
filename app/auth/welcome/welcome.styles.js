import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    tintColor: "#1E90FF",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: "#A9A9A9",
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
    fontSize: 18,
    fontWeight: "bold",
  },
  signInButton: {
    backgroundColor: "transparent",
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
    fontSize: 18,
    fontWeight: "bold",
  },
});
