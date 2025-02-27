import { StyleSheet } from "react-native";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export const useChatStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    sentMessage: (messageType) => ({
      alignSelf: "flex-end",
      backgroundColor: "#1E90FF",
      padding: messageType === "image" ? 2 : messageType === "audio" ? 0 : 5,
      paddingInline: messageType === "image" ? 2 : 10,
      borderRadius: 10,
      borderTopRightRadius: 20,
      marginVertical: responsive.height(10),
      marginRight: responsive.width(10),
      maxWidth: "70%",
    }),
    receivedMessage: (messageType) => ({
      alignSelf: "flex-start",
      backgroundColor: theme.recievedMessageBG,
      padding: messageType === "image" ? 2 : messageType === "audio" ? 0 : 5,
      paddingInline: messageType === "image" ? 2 : 10,
      borderRadius: 10,
      borderTopLeftRadius: 20,
      marginVertical: responsive.height(5),
      marginLeft: responsive.width(10),
      maxWidth: "70%",
    }),
    messageText: {
      fontSize: responsive.fontSize(14),
      color: "white",
      marginBottom: responsive.height(2),
    },
    timestamp: {
      fontSize: responsive.fontSize(12),
      color: theme.inputColor,
    },
    audioMessageContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 7,
      borderRadius: 20,
      maxWidth: "80%",
      alignSelf: "flex-start",
    },
    audioPlayButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    playIcon: {
      fontSize: 16,
      color: "white",
      fontWeight: "bold",
    },
    audioWaveform: {
      flex: 1,
      flexDirection: "row",
    },
    waveText: {
      fontSize: 18,
      color: "#075E54",
      letterSpacing: 2,
    },
    sliderContainer: {
      position: "relative",
    },
    audioDurationText: {
      color: "white",
      fontSize: 12,
      position: "absolute",
      top: 24,
      right: 0,
    },
  });
};
