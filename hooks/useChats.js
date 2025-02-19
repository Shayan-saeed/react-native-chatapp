import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";

const useChats = (chatType) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = () => {
      const currentUserID = auth.currentUser.uid;
      const chatsQuery = query(collection(db, "chats"), where("users", "array-contains", currentUserID));

      const unsubscribe = onSnapshot(chatsQuery, async (chatsSnapshot) => {
        const chatDetails = [];

        for (const docSnap of chatsSnapshot.docs) {
          const chatData = docSnap.data();

          if (chatData.type !== chatType) continue; 

          const lastMessage = chatData.lastMessage || "No messages yet";
          const timestamp = chatData.lastMessageTimestamp;
          const unreadCount = chatData.unreadCount?.[currentUserID] || 0;

          chatDetails.push({
            id: docSnap.id,
            lastMessage,
            timestamp,
            unreadCount,
            ...chatData,
          });
        }

        const sortedChats = chatDetails.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));

        setChats(sortedChats);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchChats();
  }, [chatType]);

  return { chats, loading };
};

export default useChats;
