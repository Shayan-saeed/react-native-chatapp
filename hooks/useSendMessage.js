import { useState } from "react";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../app/config/firebaseConfig";
import { Alert } from "react-native";

function useSendMessage(id, chatType, setNewMessage, setSentLoading) {

  const sendMessage = async (messageType, messageContent, waveformUrl = null, duration = null) => {
    if (!messageContent.trim()) return;

    setNewMessage("");

    try {  
      const currentUserID = auth.currentUser.uid;
      let chatID = id;

      if (chatType === "person") {
        const chatUsers = [currentUserID, id].sort();
        chatID = chatUsers.join("_");
      }
      
      const chatRef = doc(db, "chats", chatID);
      const chatSnap = await getDoc(chatRef);
      let chatData = chatSnap.exists() ? chatSnap.data() : {};
      if (chatData.leftUsers?.includes(currentUserID)) {
        Alert.alert("Error", "You have left this group and cannot send messages.");
        return;
      }
      const messagesRef = collection(chatRef, "messages");
 
      let existingUnreadCount = 0;

      if (chatSnap.exists()) {
        if (chatData.showChat?.[id] === false) {
          await updateDoc(chatRef, {
            [`showChat.${id}`]: true,
          });
        }

        if (chatType === "person") {
          existingUnreadCount = chatData.unreadCount?.[id] || 0;
        } else if (chatType === "group") {
          existingUnreadCount = chatData.unreadCount || {};
          Object.keys(existingUnreadCount).forEach((userID) => {
            existingUnreadCount[userID] = existingUnreadCount[userID] || 0;
          });
        }
      }

      const messageData = {
        sender: currentUserID,
        messageType,
        text: messageType === "text" ? messageContent : "",
        imageUrl: messageType === "image" ? messageContent : null,
        audioUrl: messageType === "audio" ? messageContent : null,
        timestamp: Timestamp.now(),
        waveformUrl: waveformUrl,
        audioDuration: duration,
      };

      await addDoc(messagesRef, messageData);
      setSentLoading(false);
      const updatedChatData = {
        users:
          chatType === "group" ? chatData.users : [currentUserID, id].sort(),
          lastMessage: messageType === "image" ? "📷 Image" : messageType === "audio" ? "🎤 Audio" : messageContent,
        lastMessageTimestamp: Timestamp.now(),
      };

      if (chatType === "person") {
        updatedChatData.unreadCount = {
          ...chatSnap.data()?.unreadCount,
          [id]: existingUnreadCount + 1,
        };
      } else if (chatType === "group") {
        updatedChatData.unreadCount = existingUnreadCount;
      }
      await setDoc(chatRef, updatedChatData, { merge: true });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSentLoading(false);
    }
  };

  return { sendMessage };
}

export default useSendMessage;

