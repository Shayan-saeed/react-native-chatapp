import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

const lightTheme = {
  backgroundColor: "#FFFFFF",
  textColor: "#000",
  subheadingColor: "#555",
  primary: "#1E90FF",
  borderColor: "#ccc",
  inputColor: "#333",
  borderBottomColor: "#ddd",
  searchContainerBG: "#f5f5f5",
  lastMessage: "#aaa",
  tabBarInactiveTintColor: "#888",
  colorMode: "light",
  groupMessageSender: "orange",
  recievedMessageBG: "#777",
};

const darkTheme = {
  backgroundColor: "#121212",
  textColor: "#fff",
  subheadingColor: "#ccc",
  primary: "#BB86FC",
  borderColor: "#555",
  inputColor: "#ddd",
  borderBottomColor: "#333",
  searchContainerBG: "#222",
  lastMessage: "#888",
  tabBarInactiveTintColor: "#bbb",
  colorMode: "dark",
  groupMessageSender: "#ccc",
  recievedMessageBG: "#333",
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
