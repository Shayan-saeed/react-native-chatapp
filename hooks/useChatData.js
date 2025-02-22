import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../app/config/firebaseConfig";

function useChatData(id) {
  const [userData, setUserData] = useState(null);
  const [chatType, setChatType] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchChatData = async () => {
      setLoadingData(true);
      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setChatType("person");
          setChatData(userDoc.data());
        }

        const chatRef = doc(db, "chats", id);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          setChatType(chatSnap.data().type);
          setChatData(chatSnap.data());
        }
      } catch (error) {
        console.error("Error fetching chat/user data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchChatData();
  }, [id]);

  return { userData, chatType, chatData, loadingData };
}

export default useChatData;