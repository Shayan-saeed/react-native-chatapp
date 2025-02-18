import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "center",
      padding: 20,
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
      fontSize: 16,
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
      fontSize: 18,
      fontWeight: "bold",
    },
    linkText: {
      textAlign: "center",
      color: "#555",
      fontSize: 16,
    },
    link: {
      color: "#1E90FF",
      fontWeight: "bold",
    },
    phoneContainer: {
      width: "100%",
      height: 70,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 20,
      backgroundColor: "white",
    },
    phoneTextContainer: {
      backgroundColor: "transparent",
      borderRadius: 8,
      height: 70,
    },
    phoneTextInput: {
      fontSize: 16,
      color: "#000",
    },
    phoneCodeText: {
      fontSize: 16,
      color: "#000",
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
      fontSize: 16,
      color: "#333",
    },
  });