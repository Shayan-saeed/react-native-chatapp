import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import {
  collection,
  onSnapshot,
  Timestamp,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { Backdrop } from "react-native-backdrop";
import AntDesign from "@expo/vector-icons/AntDesign";
import MainScreenHeader from "@/components/ui/MainScreenHeader";
import ChatList from "@/components/chat/ChatList";
import ProfileModal from "@/components/modal/ProfileModal"
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ChatListLoader from "@/components/loaders/ChatListLoader";
import {useChatStyles} from "./groups.styles";

import responsive from "@/utils/responsive";
export default function ContactsScreen() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [visible, setVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const styles = useChatStyles();

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchGroups = () => {
      const currentUserID = auth.currentUser.uid;
  
      const chatsQuery = collection(db, "chats");
      const unsubscribe = onSnapshot(chatsQuery, async (chatsSnapshot) => {
        const groupDetails = [];

        chatsSnapshot.forEach((doc) => {
          const chatData = doc.data();

          if (
            chatData.type === "group" && 
            chatData.users?.length > 1 &&
            chatData.users.includes(currentUserID)
          ) {
            const lastMessage = chatData.lastMessage || "No messages yet";
            const timestamp = chatData.lastMessageTimestamp;  
            
            groupDetails.push({
              id: doc.id,
              lastMessage,
              timestamp,
              ...chatData,
            });
          }
        });

        const sortedGroups = groupDetails.sort((a, b) => {
          return (
            (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)
          );
        });
  
        setGroups(sortedGroups);
        setLoadingGroups(false);
      });
  
      return () => unsubscribe();
    };
  
    fetchGroups();
  }, []);
  
  

  useEffect(() => {
      setFilteredGroups(groups);
    }, [groups]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setFilteredGroups(groups);
      return;
    }
    const filtered = groups.filter((group) =>
      group.groupName?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((selectedUser) => selectedUser.id === user.id)
        ? prev.filter((selectedUser) => selectedUser.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreateGroupChat = async () => {
    const creatorId = auth.currentUser.uid;
    if (!groupName.trim()) {
      Alert.alert("Please enter a group name");
      return;
    }
    if (selectedUsers.length < 1) {
      Alert.alert("Please select at least 1 user to create a group");
      return;
    }

    setLoading(true);
    try {
      const groupUsers = [creatorId, ...selectedUsers.map((user) => user.id)];

      const unreadCount = {};
      groupUsers.forEach((userID) => {
        unreadCount[userID] = 0;
      });

      const groupChatRef = await addDoc(collection(db, "chats"), {
        type: "group",
        groupName,
        groupImage: "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg",
        users: groupUsers,
        lastMessage: "",
        lastMessageTimestamp: Timestamp.now(),
        unreadCount,
      });

      const groupChatId = groupChatRef.id;

      Alert.alert("Group chat created successfully!");
      setVisible(false);
      setGroupName("");
      setSelectedUsers([]);
      setEmail("");
    } catch (error) {
      console.error("Error creating group chat:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email.trim()) {
      setUsersList([]); 
      return;
    }
  
    const currentUserID = auth.currentUser.uid; 
    const usersRef = collection(db, "users");
  
    const q = query(
      usersRef,
      where("email", ">=", email.toLowerCase()),  
      where("email", "<", email.toLowerCase() + "\uf8ff")
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUserID); 
  
      setUsersList(users);
    });
  
    return () => unsubscribe();
  }, [email]);

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
      {loadingGroups ? (
        <ChatListLoader />
      ) : 
        groups.length > 0 ? (
        <ChatList items={filteredGroups} setSelectedData={setSelectedGroupData} setIsProfileModalVisible={setIsProfileModalVisible} />
      ) : (
        <View style={{ marginLeft: responsive.width(2), marginTop: responsive.height(5) }}>
          <Text style={{ color: "white", fontSize: responsive.fontSize(15) }}>
            No groups found. Create a new group!
          </Text>
        </View>
      )}
      

      <ProfileModal isProfileModalVisible={isProfileModalVisible} selectedData={selectedGroupData} setIsProfileModalVisible={setIsProfileModalVisible} />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(true)}
      >
        <AntDesign name="addusergroup" size={30} color="white" />
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
        <View style={styles.dragIndicator} />
        <Text style={styles.heading}>Create a Group Chat</Text>

        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Search Users by Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />

        <FlatList
          data={usersList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.userItem,
                selectedUsers.some((user) => user.id === item.id) &&
                  styles.selectedUser,
              ]}
              onPress={() => handleSelectUser(item)}
            >
              <Text style={styles.userText}>{item.email}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateGroupChat}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Group"}
          </Text>
        </TouchableOpacity>
      </Backdrop>
    </GestureHandlerRootView>
  );
}
