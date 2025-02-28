import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import {
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { db, auth } from "../../../config/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonHeader from "@/components/loaders/SkeletonHeader";
import { useChatStyles } from "./userdetails.styles";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";
import AddUserBottomSheet from "@/components/ui/AddUserToGroup";

const UserDetails = () => {
  const { id, name, profileImage, chatType } = useLocalSearchParams();
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [groupMembersWithNames, setGroupMembersWithNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const styles = useChatStyles();
  const theme = useTheme();
  const [showAddUserSheet, setShowAddUserSheet] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [addUserloading, setAddUserLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (chatType === "group") {
        fetchGroupDetails();
      }
    }, [chatType, id])
  );

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      setGroupMembers([]);
      setGroupMembersWithNames([]);
      const groupDoc = await getDoc(doc(db, "chats", id));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const activeMembers = (groupData.users || []).filter(
          (user) => !(groupData.leftUsers || []).includes(user)
        );
        setGroupMembers(activeMembers.length > 0 ? activeMembers : []);
        setGroupImage(groupData.groupImage);

        const currentUser = auth.currentUser.uid;
        setIsAdmin(groupData.groupAdmin === currentUser);
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadToCloudinary(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    try {
      setUploading(true);
      let formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "group.jpg",
      });
      formData.append("upload_preset", "user_uploads");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dir9vradu/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        updateGroupImage(data.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const updateGroupImage = async (url) => {
    try {
      const groupRef = doc(db, "chats", id);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        await updateDoc(groupRef, {
          groupImage: url,
        });
        setGroupImage(url);
      } else {
        console.error("Group document does not exist.");
      }
    } catch (error) {
      console.error("Error updating group image:", error);
    }
  };

  const fetchUserNames = async () => {
    if (!groupMembers || groupMembers.length === 0) {
      return;
    }
    try {
      const chatDocRef = doc(db, "chats", id);
      const chatDocSnap = await getDoc(chatDocRef);

      let adminID = null;
      if (chatDocSnap.exists()) {
        adminID = chatDocSnap.data().groupAdmin;
      }

      const usersData = await Promise.all(
        groupMembers.map(async (userID) => {
          if (!userID) return null;
          const userDoc = await getDoc(doc(db, "users", userID));
          if (userDoc.exists()) {
            return {
              id: userID,
              name:
                userID === auth.currentUser.uid ? "You" : userDoc.data().name,
              profileImage: userDoc.data().profileImage,
              isAdmin: userID === adminID,
            };
          }
          return null;
        })
      );
      const filteredUsers = usersData.filter((user) => user !== null);
      const currentUser = auth.currentUser.uid;

      const adminUser = filteredUsers.find((user) => user.id === adminID);

      const sortedUsers = [
        filteredUsers.find((user) => user.id === currentUser),
        adminUser && adminUser.id !== currentUser ? adminUser : null,
        ...filteredUsers.filter(
          (user) => user.id !== currentUser && user.id !== adminID
        ),
      ].filter(Boolean);

      setGroupMembersWithNames(sortedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

  useEffect(() => {
    if (groupMembers.length > 0) {
      fetchUserNames();
    }
  }, [groupMembers]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowAddUserSheet(false);
        router.push(`/chat/${id}`);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [id])
  );

  const handleLeaveGroup = async () => {
    if (chatType !== "group") return;

    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          const currentUserID = auth.currentUser?.uid;

          if (!id || !currentUserID) {
            Alert.alert("Error", "Invalid group or user.");
            return;
          }

          try {
            const chatRef = doc(db, "chats", id);
            const groupDoc = await getDoc(chatRef);

            if (!groupDoc.exists()) {
              Alert.alert("Error", "Group does not exist.");
              return;
            }

            const groupData = groupDoc.data();
            const leftUsers = groupData.leftUsers || [];

            if (leftUsers.includes(currentUserID)) {
              Alert.alert("Error", "You have already left this group.");
              return;
            }

            await updateDoc(chatRef, {
              leftUsers: arrayUnion(currentUserID),
            });

            const userName = auth.currentUser.displayName;

            const messagesRef = collection(chatRef, "messages");
            await addDoc(messagesRef, {
              sender: "system",
              text: `${userName} left the group.`,
              timestamp: serverTimestamp(),
            });

            const updatedUsers = groupData.users || [];
            if (updatedUsers.length < 1) {
              await deleteDoc(chatRef);
              console.log("Group deleted as it had less than 1 member.");
            }

            router.replace("/chat/screens/groups");
          } catch (error) {
            console.error("Error leaving group:", error);
            Alert.alert("Error", "Failed to leave group. Please try again.");
          }
        },
      },
    ]);
  };

  const openAddUserSheet = () => setShowAddUserSheet(true);
  const closeAddUserSheet = () => setShowAddUserSheet(false);

  const handleAddUserToGroup = async () => {
    if (!userEmail.trim()) {
      Alert.alert("Error", "Please enter an email.");
      return;
    }

    setAddUserLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", userEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "User not found.");
        setAddUserLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      if (groupMembersWithNames.some((member) => member.id === userId)) {
        Alert.alert("Error", "User is already a member of the group.");
        setAddUserLoading(false);
        return;
      }

      const chatRef = doc(db, "chats", id);
      await updateDoc(chatRef, {
        users: arrayUnion(userId),
      });

      Alert.alert("Success", "User added to the group.");
      setUserEmail("");
      closeAddUserSheet();
      await fetchGroupDetails();
    } catch (error) {
      console.error("Error adding user to group:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setAddUserLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push(`/chat/${id}`)}
      >
        <Ionicons name="arrow-back" size={24} color={theme.textColor} />
      </TouchableOpacity>

      <View>
        <Image
          source={{
            uri:
              chatType === "group"
                ? groupImage ||
                  "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg"
                : profileImage,
          }}
          style={styles.groupImage}
        />
        {chatType === "group" &&
          groupMembersWithNames.find(
            (member) => member.id === auth.currentUser.uid
          )?.isAdmin && (
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="photo-camera" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          )}
      </View>

      <Text style={styles.userName}>
        {chatType === "group" ? name : name || "Unknown User"}
      </Text>

      <AddUserBottomSheet
        visible={showAddUserSheet}
        onClose={closeAddUserSheet}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        loading={addUserloading}
        handleAddUser={handleAddUserToGroup}
        setLoading={setAddUserLoading}
      />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call" size={20} color={theme.textColor} />
          <Text style={styles.actionText}>Audio</Text>
        </TouchableOpacity>

        {chatType === "group" &&
          groupMembersWithNames.length > 0 &&
          groupMembersWithNames.find(
            (member) => member.id === auth.currentUser.uid
          )?.isAdmin && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={openAddUserSheet}
            >
              <Ionicons name="person-add" size={20} color="#fff" />
              <Text
                style={[
                  styles.actionText,
                  { flexWrap: "wrap", textAlign: "center" },
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          )}

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="search" size={24} color={theme.textColor} />
          <Text style={styles.actionText}>Search</Text>
        </TouchableOpacity>
      </View>

      {chatType === "group" && (
        <View
          style={{
            flex: 1,
            width: "100%",
            marginVertical: responsive.height(20),
            backgroundColor: theme.searchContainerBG,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: theme.textColor,
              fontSize: responsive.fontSize(17),
              fontWeight: "bold",
            }}
          >
            Group Members
          </Text>
          {loading ? (
            <View style={{ gap: 4 }}>
              <SkeletonHeader />
              <SkeletonHeader />
            </View>
          ) : (
            <FlatList
              data={groupMembersWithNames}
              renderItem={({ item }) => (
                <View style={styles.groupMemberItem}>
                  <Image
                    source={{
                      uri:
                        item?.profileImage ||
                        "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                    }}
                    style={styles.profileImage}
                  />
                  <Text
                    style={{
                      color: theme.textColor,
                      fontSize: responsive.fontSize(16),
                      marginLeft: responsive.width(10),
                    }}
                  >
                    {item.name}
                  </Text>
                  {item.isAdmin && <Text style={styles.adminBadge}>Admin</Text>}
                </View>
              )}
              keyExtractor={(item) => item.id}
              style={styles.groupMembersList}
            />
          )}
        </View>
      )}

      <TouchableOpacity style={styles.optionRow} onPress={handleLeaveGroup}>
        <MaterialIcons name="block" size={24} color="#FF4D4D" />
        <Text style={styles.optionText}>
          {chatType === "group" ? "Leave" : "Block"} {name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionRow}>
        <FontAwesome name="thumbs-down" size={24} color="orange" />
        <Text style={styles.optionText}>Report {name}</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

export default UserDetails;
