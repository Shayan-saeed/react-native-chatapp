import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
    fontSize: 18,
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
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  input: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingVertical: 5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderColor: "#1E90FF",
    borderWidth: 1,
    padding: 12,
    borderRadius: 30,
    marginTop: 30,
    width: "80%",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
  },
});