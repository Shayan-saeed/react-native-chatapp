import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { formatTimestamp } from "@/utils/time";
import { useChatStyles } from "./chatlist.styles";
import { doc, updateDoc, arrayUnion, Timestamp, getDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../../../app/config/firebaseConfig";

export default function ChatList({
  items,
  setSelectedData,
  setIsProfileModalVisible,
}) {

  const styles = useChatStyles();
  const user = auth.currentUser;

  const handleDeleteChat = async (chatId) => {
    if (!user) return;

    const chatUsers = [user.uid, chatId].sort();
    const id = chatUsers.join("_");

    const chatRef = doc(db, "chats", id);
    const timestamp = Timestamp.now();

    try {
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) return;

      const chatData = chatDoc.data();
      const deletedByArray = chatData.deletedBy || [];

      const existingEntry = deletedByArray.find(entry => entry.userId === user.uid);

      if (existingEntry) {
        await updateDoc(chatRef, {
          deletedBy: arrayRemove(existingEntry),
        });
      }
      await updateDoc(chatRef, {
        deletedBy: arrayUnion({ userId: user.uid, timestamp }),
        [`showChat.${user.uid}`]: false,
      });

    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const confirmDeleteChat = (chatId, chatType) => {
    if(chatType === "group") return;
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDeleteChat(chatId), style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push(`/chat/${item.id}`)}
            onLongPress={() => confirmDeleteChat(item.id, item.type)}
          >
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => {
                setSelectedData(item);
                setIsProfileModalVisible(true);
              }}
            >
              <Image
                source={{
                  uri: item.profileImage || item.groupImage || "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg",
                }}                
                style={styles.profileImage}
              />
            </TouchableOpacity>

            <View style={styles.chatTextContainer}>
              <Text style={styles.chatName}>
                {item.name ? item.name : item.groupName}
              </Text>
              <Text style={styles.lastMessage}>
                {item.lastMessage && item.lastMessage.length > 25
                  ? item.lastMessage.slice(0, 25) + "..."
                  : item.lastMessage || "No messages yet"}
              </Text>
            </View>
            <View style={styles.timestampContainer}>
              <Text style={styles.timestamp}>
                {formatTimestamp(
                  item.timestamp ? item.timestamp : item.lastMessageTimestamp
                )}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
  );
}
