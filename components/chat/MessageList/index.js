import { View, Text, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import React from "react";
import SkeletonMessage from "@/components/loaders/SkeletonMessage";
import { formatTimestamp } from "@/utils/time";
import responsive from "@/utils/responsive";
import { auth , db} from "../../../app/config/firebaseConfig";
import { useChatStyles } from "./messagelist.styles";
import { doc, updateDoc } from "firebase/firestore";
import {useTheme} from "@/components/theme/ThemeContext";

export default function index({
  messages,
  loadingMessages,
  chatType,
  openImageModal,
  id
}) {
  const styles = useChatStyles();
  const theme = useTheme();
  const handleDeleteMessage = async (messageId) => {
    let chatID = id;
    const currentUserID = auth.currentUser.uid;
    if (chatType === "person") {
      const chatUser = [currentUserID, id].sort();
      chatID = chatUser.join("_");
    }
    try {
      const messageRef = doc(db, "chats", chatID, "messages", messageId);
      await updateDoc(messageRef, { [`isDeleted.${currentUserID}`]:  true });
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
        { text: "Delete", onPress: () => handleDeleteMessage(messageId), style: "destructive" }
      ]
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={loadingMessages ? Array(5).fill({}) : messages}
        keyExtractor={(item, index) =>
          loadingMessages ? index.toString() : item.id
        }
        renderItem={({ item, index }) =>
          loadingMessages ? (
            <SkeletonMessage isSender={index % 2 === 0} />
          ) : (
            <View>
              <TouchableOpacity
                onLongPress={() => confirmDeleteMessage(item.id)}
              >
                <View
                  style={
                    item.sender === auth.currentUser.uid
                      ? styles.sentMessage(item.isUrl)
                      : styles.receivedMessage(item.isUrl)
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
                  {item.isUrl ? (
                    <TouchableOpacity
                      onPress={() => openImageModal(item.displayContent)}
                    >
                      <Image
                        source={{ uri: item.displayContent }}
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
                  ) : (
                    <Text style={styles.messageText}>{item.text}</Text>
                  )}
                </View>
              </TouchableOpacity>
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
