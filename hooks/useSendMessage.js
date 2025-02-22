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

function useSendMessage(id, chatType, setNewMessage) {
  const sendMessage = async (messageContent, isImage = false) => {
    if (!messageContent.trim()) return;

    try {
      setNewMessage("");
      const currentUserID = auth.currentUser.uid;
      let chatID = id;

      if (chatType === "person") {
        const chatUsers = [currentUserID, id].sort();
        chatID = chatUsers.join("_");
      }

      const chatRef = doc(db, "chats", chatID);
      const messagesRef = collection(chatRef, "messages");

      const chatSnap = await getDoc(chatRef);
      let existingUnreadCount = 0;

      if (chatSnap.exists()) {
        const chatData = chatSnap.data();

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
        text: isImage ? "" : messageContent,
        imageUrl: isImage ? messageContent : null,
        isUrl: isImage,
        timestamp: Timestamp.now(),
      };

      await addDoc(messagesRef, messageData);

      const updatedChatData = {
        users:
          chatType === "group" ? chatData.users : [currentUserID, id].sort(),
        lastMessage: isImage ? "📷 Image" : messageContent,
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
    }
  };

  return { sendMessage };
}

export default useSendMessage;
