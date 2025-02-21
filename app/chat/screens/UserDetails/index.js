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
import { getDoc, doc, arrayRemove, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonHeader from "@/components/loaders/SkeletonHeader";
import { useChatStyles } from "./userdetails.styles";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

const UserDetails = () => {
  const { id, name, profileImage, chatType } = useLocalSearchParams();
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [groupMembersWithNames, setGroupMembersWithNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const styles = useChatStyles();
  const theme = useTheme();

  useEffect(() => {
    if (chatType === "group") {
      const fetchGroupDetails = async () => {
        try {
          setLoading(true);
          setGroupMembers([]);
          setGroupMembersWithNames([]);
          const groupDoc = await getDoc(doc(db, "chats", id));
          if (groupDoc.exists()) {
            const groupData = groupDoc.data();
            setGroupMembers(groupData.users);
            setGroupImage(groupData.groupImage);
          }
        } catch (error) {
          console.error("Error fetching group details:", error);
        }
      };
      fetchGroupDetails();
    }
  }, [chatType, id]);

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
    try {
      const usersData = await Promise.all(
        groupMembers.map(async (userID) => {
          const userDoc = await getDoc(doc(db, "users", userID));
          if (userDoc.exists()) {
            return {
              id: userID,
              name: userDoc.data().name,
              profileImage: userDoc.data().profileImage,
            };
          }
          return null;
        })
      );
      const filteredUsers = usersData.filter((user) => user !== null);
      const currentUser = auth.currentUser.uid;
      const usersWithCurrentOnTop = [
        filteredUsers.find((user) => user.id === currentUser),
        ...filteredUsers.filter((user) => user.id !== currentUser),
      ];
      setGroupMembersWithNames(usersWithCurrentOnTop);
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

    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group?",
      [
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
              await updateDoc(chatRef, {
                users: arrayRemove(currentUserID),
              });

              const groupDoc = await getDoc(chatRef);
              if (groupDoc.exists()) {
                const updatedUsers = groupDoc.data().users || [];

                if (updatedUsers.length < 2) {
                  await deleteDoc(chatRef);
                  console.log("Group deleted as it had less than 2 members.");
                }
              }

              router.replace("/chat/screens/groups");
            } catch (error) {
              console.error("Error leaving group:", error);
              Alert.alert("Error", "Failed to leave group. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
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
        {chatType === "group" && (
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

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call" size={24} color={theme.textColor} />
          <Text style={styles.actionText}>Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="videocam" size={24} color={theme.textColor} />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>

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
    </View>
  );
};

export default UserDetails;
