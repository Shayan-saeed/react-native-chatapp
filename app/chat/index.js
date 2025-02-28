import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  getDoc,
  where,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Backdrop } from "react-native-backdrop";
import MainScreenHeader from "@/components/ui/MainScreenHeader";
import ChatList from "@/components/chat/ChatList";
import ProfileModal from "@/components/modal/ProfileModal";
import ChatListLoader from "@/components/loaders/ChatListLoader";
import { useFocusEffect } from "@react-navigation/native";
import { useChatStyles } from "./index.styles";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";
import StartChatBottomSheet from "@/components/ui/StartChatBottomSheet";

export default function ChatListScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startChatLoading, setStartChatLoading] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const styles = useChatStyles();
  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const currentUserID = auth.currentUser.uid;

      const chatsQuery = query(
        collection(db, "chats"),
        where("users", "array-contains", currentUserID)
      );

      const unsubscribe = onSnapshot(chatsQuery, async (chatsSnapshot) => {
        if (chatsSnapshot.empty) {
          console.log("No chats found");
          setUsers([]);
          setLoading(false);
          return;
        }

        const chatUsers = new Set();
        const chatDetails = [];

        for (const doc of chatsSnapshot.docs) {
          const chatData = doc.data();

          if (chatData.type !== "person") continue;
          if (chatData.showChat?.[currentUserID] === false) continue;

          const usersArray = chatData.users;
          const otherUserID = usersArray.find((uid) => uid !== currentUserID);

          if (otherUserID) {
            chatUsers.add(otherUserID);
            const lastMessage = chatData.lastMessage || "No messages yet";
            const timestamp = chatData.lastMessageTimestamp;
            const unreadCount = chatData.unreadCount?.[currentUserID] || 0;

            let deletedByTimestamp = null;
            if (Array.isArray(chatData.deletedBy)) {
              const deletedEntry = chatData.deletedBy.find(
                (entry) => entry.userId === currentUserID
              );
              deletedByTimestamp = deletedEntry ? deletedEntry.timestamp : null;
            }

            const showMessage =
              !deletedByTimestamp ||
              !timestamp ||
              timestamp.toMillis() > deletedByTimestamp.toMillis();

            chatDetails.push({
              id: doc.id,
              otherUserID,
              lastMessage: showMessage ? lastMessage : "No messages yet",
              timestamp,
              unreadCount,
            });
          }
        }

        const usersPromises = [...chatUsers].map((userID) =>
          getDoc(doc(db, "users", userID))
        );

        const usersSnapshots = await Promise.all(usersPromises);
        const usersList = usersSnapshots
          .filter((snap) => snap.exists())
          .map((snap) => ({ id: snap.id, ...snap.data() }));

        const usersWithMessages = usersList.map((user) => {
          const userChat = chatDetails.find(
            (chat) => chat.otherUserID === user.id
          );
          return {
            ...user,
            lastMessage: userChat ? userChat.lastMessage : "No messages yet",
            timestamp: userChat ? userChat.timestamp : null,
            unreadCount: userChat ? userChat.unreadCount : 0,
          };
        });

        const sortedUsers = usersWithMessages.sort((a, b) => {
          return (
            (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)
          );
        });

        console.log(sortedUsers);
        setUsers(sortedUsers);
        setLoading(false);
      });

      return () => unsubscribe();
    }, [])
  );

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter((user) =>
      user.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleNewChat = async () => {
    if (!newChatEmail.trim()) {
      Alert.alert("Please enter an email");
      return;
    }

    setStartChatLoading(true);

    try {
      const currentUserEmail = auth.currentUser.email;
      const usersRef = collection(db, "users");
      if (newChatEmail === currentUserEmail) {
        Alert.alert("You can't start a chat with yourself");
        return;
      }
      const q = query(usersRef, where("email", "==", newChatEmail));

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        Alert.alert("User not found", "No user with this email exists.");
        setStartChatLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userToChatWith = { id: userDoc.id, ...userDoc.data() };

      console.log(userToChatWith);

      const currentUserID = auth.currentUser.uid;
      const chatUsers = [currentUserID, userToChatWith.id].sort();
      const chatID = chatUsers.join("_");

      const chatRef = doc(db, "chats", chatID);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        const chatData = chatSnap.data();

        if (chatData.showChat?.[currentUserID] === false) {
          await updateDoc(chatRef, {
            [`showChat.${currentUserID}`]: true,
          });
        }
      } else {
        await setDoc(chatRef, {
          type: "person",
          users: chatUsers,
          lastMessage: "",
          lastMessageTimestamp: Timestamp.now(),
          unreadCount: {
            [currentUserID]: 0,
            [userToChatWith.id]: 0,
          },
          showChat: {
            [currentUserID]: true,
            [userToChatWith.id]: true,
          },
        });
      }
      setVisible(false);
      setNewChatEmail("");
    } catch (error) {
      console.error("Error checking email:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setStartChatLoading(false);
    }
  };
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <MainScreenHeader headerName="ChatApp" />
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.lastMessage}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={theme.lastMessage}
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <ChatListLoader />
      ) : users.length > 0 ? (
        <ChatList
          items={filteredUsers}
          setSelectedData={setSelectedUserData}
          setIsProfileModalVisible={setIsProfileModalVisible}
        />
      ) : (
        <View
          style={{
            marginLeft: responsive.width(2),
            marginTop: responsive.height(5),
          }}
        >
          <Text
            style={{
              color: theme.textColor,
              fontSize: responsive.fontSize(15),
            }}
          >
            No chats found. Start a new chat!
          </Text>
        </View>
      )}

      <ProfileModal
        isProfileModalVisible={isProfileModalVisible}
        selectedData={selectedUserData}
        setIsProfileModalVisible={setIsProfileModalVisible}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(true)}
      >
        <MaterialIcons name="add-comment" size={30} color="white" />
      </TouchableOpacity>
      {visible && (
        <StartChatBottomSheet
          visible={visible}
          startChatLoading={startChatLoading}
          handleNewChat={handleNewChat}
          newChatEmail={newChatEmail}
          setNewChatEmail={setNewChatEmail}
          onClose={() => setVisible(false)}
        />
      )}
    </GestureHandlerRootView>
  );
}
