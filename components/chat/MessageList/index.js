import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import SkeletonMessage from "@/components/loaders/SkeletonMessage";
import { formatTimestamp } from "@/utils/time";
import responsive from "@/utils/responsive";
import { auth, db } from "../../../app/config/firebaseConfig";
import { useChatStyles } from "./messagelist.styles";
import { doc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme/ThemeContext";
import { Audio } from "expo-av";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";

const formatDuration = (duration) => {
  if (!duration) return "0:00";

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function index({
  messages,
  loadingMessages,
  sentLoading,
  chatType,
  openImageModal,
  id,
}) {
  const styles = useChatStyles();
  const theme = useTheme();
  const [currentSound, setCurrentSound] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const displayMessages = sentLoading
    ? [
        {
          id: "sending",
          sender: auth.currentUser.uid,
          messageType: "text",
          text: "Sending...",
          timestamp: new Date(),
        },
        ...messages,
      ]
    : messages;

  const handleDeleteMessage = async (messageId) => {
    let chatID = id;
    const currentUserID = auth.currentUser.uid;
    if (chatType === "person") {
      const chatUser = [currentUserID, id].sort();
      chatID = chatUser.join("_");
    }
    try {
      const messageRef = doc(db, "chats", chatID, "messages", messageId);
      await updateDoc(messageRef, { [`isDeleted.${currentUserID}`]: true });
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const confirmDeleteMessage = (messageId) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteMessage(messageId),
          style: "destructive",
        },
      ]
    );
  };

  const playAudio = async (audioUrl, messageId) => {
    try {
      if (currentSound && playingAudioId === messageId) {
        const status = await currentSound.getStatusAsync();
        if (status.isPlaying) {
          await currentSound.pauseAsync();
          setIsPlaying(false);
          setAudioPosition(status.positionMillis);
        } else {
          await currentSound.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setPlayingAudioId(null);
      }

      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setCurrentSound(sound);
      setPlayingAudioId(messageId);
      setIsPlaying(true);

      const status = await sound.getStatusAsync();
      setAudioDuration(status.durationMillis);

      if (audioPosition > 0) {
        await sound.setPositionAsync(audioPosition);
      }

      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
          setCurrentSound(null);
          setPlayingAudioId(null);
          setIsPlaying(false);
          setAudioPosition(0);
        } else {
          setAudioPosition(status.positionMillis);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={loadingMessages ? Array(5).fill({}) : displayMessages}
        keyExtractor={(item, index) =>
          loadingMessages ? index.toString() : item.id
        }
        renderItem={({ item, index }) =>
          loadingMessages ? (
            <SkeletonMessage isSender={index % 2 === 0} />
          ) : item.id === "sending" ? (
            <View style={styles.sentMessage("text")}>
              <Text style={styles.messageText}>Sending...</Text>
            </View>
          ) : item.sender === "system" ? (
            <View style={{alignSelf: "center"}}>
              <Text style={{color: "#ccc", fontSize: 14}}>{item.text}</Text>
            </View>
          ) : (
            <View>
              <View
                style={
                  item.sender === auth.currentUser.uid
                    ? styles.sentMessage(item.messageType)
                    : styles.receivedMessage(item.messageType)
                }
              >
                {chatType === "group" &&
                  item.senderName &&
                  item.sender !== auth.currentUser.uid && (
                    <Text
                      style={{
                        color: theme.groupMessageSender,
                        fontSize: responsive.fontSize(14),
                        marginBottom: responsive.height(2),
                        fontWeight: 700,
                      }}
                    >
                      {item.senderName}
                    </Text>
                  )}
                {item.messageType === "image" ? (
                  <TouchableOpacity
                    onPress={() => openImageModal(item.imageUrl)}
                    onLongPress={() => confirmDeleteMessage(item.id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{
                        width: responsive.width(200),
                        height: responsive.height(200),
                        borderRadius: 10,
                        borderTopRightRadius:
                          item.sender === auth.currentUser.uid ? 20 : 10,
                        borderTopLeftRadius:
                          item.sender === auth.currentUser.uid ? 10 : 20,
                        zIndex: 1,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : item.messageType === "audio" ? (
                  <TouchableOpacity
                    onPress={() => playAudio(item.audioUrl, item.id)}
                    onLongPress={() => confirmDeleteMessage(item.id)}
                    activeOpacity={0.7}
                    style={styles.audioMessageContainer}
                  >
                    <View style={styles.audioPlayButton}>
                      <FontAwesome5
                        name={
                          playingAudioId === item.id && isPlaying
                            ? "pause"
                            : "play"
                        }
                        size={20}
                        color="white"
                      />
                    </View>
                    <View style={styles.sliderContainer}>
                      <Slider
                        style={{
                          width: responsive.width(150),
                          height: responsive.height(40),
                        }}
                        minimumValue={0}
                        maximumValue={audioDuration}
                        value={playingAudioId === item.id ? audioPosition : 0}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#ccc"
                        thumbTintColor="#FFFFFF"
                        onSlidingComplete={async (value) => {
                          if (currentSound && playingAudioId === item.id) {
                            await currentSound.setPositionAsync(value);
                            await currentSound.playAsync();
                            setIsPlaying(true);
                          }
                        }}
                      />
                      <Text style={styles.audioDurationText}>
                        {formatDuration(item.audioDuration)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onLongPress={() => confirmDeleteMessage(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.messageText}>{item.text}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text
                style={[
                  styles.timestamp,
                  item.sender === auth.currentUser.uid
                    ? {
                        alignSelf: "flex-end",
                        marginRight: responsive.width(15),
                      }
                    : {
                        alignSelf: "flex-start",
                        marginLeft: responsive.width(15),
                      },
                ]}
              >
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: responsive.height(10) }}
        inverted
      />
    </View>
  );
}
