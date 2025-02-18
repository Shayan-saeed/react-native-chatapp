import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert
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
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Backdrop } from "react-native-backdrop";
import MainScreenHeader from "@/components/ui/MainScreenHeader";
import ChatList from "@/components/chat/ChatList";
import ProfileModal from "@/components/modal/ProfileModal";
import ChatListLoader from "@/components/loaders/ChatListLoader";
import styles from "./index.styles"

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

  useEffect(() => {
    const fetchUsers = () => {
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

          const usersArray = chatData.users;
          const otherUserID = usersArray.find((uid) => uid !== currentUserID);

          if (otherUserID) {
            chatUsers.add(otherUserID);
            const lastMessage = chatData.lastMessage || "No messages yet";
            const timestamp = chatData.lastMessageTimestamp;
            const unreadCount = chatData.unreadCount?.[currentUserID] || 0;

            chatDetails.push({
              id: doc.id,
              otherUserID,
              lastMessage,
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
    };

    fetchUsers();
  }, []);

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

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          type: "person",
          users: chatUsers,
          lastMessage: "",
          lastMessageTimestamp: Timestamp.now(),
          unreadCount: {
            [currentUserID]: 0,
            [userToChatWith.id]: 0,
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

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MainScreenHeader />
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <ChatListLoader />
      ) : users.length > 0 ? ( 
        <ChatList items={filteredUsers} setSelectedData={setSelectedUserData} setIsProfileModalVisible={setIsProfileModalVisible} />
      ) : (
        <View style={{ marginLeft: 2, marginTop: 5 }}>
          <Text style={{ color: "white", fontSize: 15 }}>
            No chats found. Start a new chat!
          </Text>
        </View>
      )}

      <ProfileModal isProfileModalVisible={isProfileModalVisible} selectedData={selectedUserData} setIsProfileModalVisible={setIsProfileModalVisible} />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(true)}
      >
        <MaterialIcons name="add-comment" size={30} color="white" />
      </TouchableOpacity>

      <Backdrop
        visible={visible}
        handleOpen={handleOpen}
        handleClose={handleClose}
        onClose={() => {}}
        swipeConfig={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        animationConfig={{
          speed: 14,
          bounciness: 4,
        }}
        overlayColor="rgba(0,0,0,0.32)"
        containerStyle={styles.backdropStyle}
      >
        <Text style={styles.modalTitle}>Start a New Chat</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#888"
            value={newChatEmail}
            onChangeText={setNewChatEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, startChatLoading && styles.buttonDisabled]}
          onPress={handleNewChat}
          disabled={startChatLoading}
        >
          <Text style={styles.buttonText}>
            {startChatLoading ? "Starting..." : "Start Chat"}
          </Text>
        </TouchableOpacity>
      </Backdrop>
    </GestureHandlerRootView>
  );
}

