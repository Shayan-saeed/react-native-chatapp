import { useState, useEffect, useCallback } from "react";
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../app/config/firebaseConfig"
import { useFocusEffect } from "@react-navigation/native";

function useMessages(id, chatType) {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!id || !chatType) return;

      setMessages([]);
      setLoadingMessages(true);

      const currentUserID = auth.currentUser.uid;
      let chatID = id;

      if (chatType === "person") {
        const chatUsers = [currentUserID, id].sort();
        chatID = chatUsers.join("_");
      }

      const chatRef = doc(db, "chats", chatID);
      const messagesRef = collection(chatRef, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (!snapshot.empty) {
          let deletedTimestamp = null;
          const chatSnap = await getDoc(chatRef);

          if (chatSnap.exists()) {
            const chatData = chatSnap.data();

            if (Array.isArray(chatData.deletedBy)) {
              const userDeleteEntry = chatData.deletedBy.find(
                (entry) => entry.userId === currentUserID
              );
              if (userDeleteEntry) {
                deletedTimestamp = userDeleteEntry.timestamp;
              }
            }

            if (chatData.unreadCount && chatData.unreadCount[currentUserID] !== 0) {
              const updatedUnreadCount = {
                ...chatData.unreadCount,
                [currentUserID]: 0,
              };
              await setDoc(chatRef, { unreadCount: updatedUnreadCount }, { merge: true });
            }
          }

          const messagesData = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              displayContent: doc.data().isUrl
                ? doc.data().imageUrl
                : doc.data().text || "",
            }))
            .filter((msg) =>
              deletedTimestamp
                ? msg.timestamp.toMillis() > deletedTimestamp.seconds * 1000
                : true
            );

          if (chatType === "group") {
            const senderIDs = [...new Set(messagesData.map((msg) => msg.sender))];

            const senderPromises = senderIDs.map(async (senderID) => {
              const userDoc = await getDoc(doc(db, "users", senderID));
              return {
                id: senderID,
                name: userDoc.exists() ? userDoc.data().name : "Unknown",
              };
            });

            const senderResults = await Promise.all(senderPromises);
            const senderNameMap = senderResults.reduce((acc, sender) => {
              acc[sender.id] = sender.name;
              return acc;
            }, {});

            setMessages(
              messagesData.map((msg) => ({
                ...msg,
                senderName: senderNameMap[msg.sender] || "Unknown",
              }))
            );
          } else {
            setMessages(messagesData);
          }
        } else {
          setMessages([]);
        }

        setLoadingMessages(false);
      });

      return () => unsubscribe();
    }, [id, chatType])
  );

  return { messages, loadingMessages };
}

export default useMessages;