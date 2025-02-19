import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";
import SkeletonHeader from "@/components/loaders/SkeletonHeader";
import {useChatStyles} from "./userdetails.styles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from "@/components/theme/ThemeContext";

const UserDetails = () => {
  const { id, name, profileImage, chatType } = useLocalSearchParams();
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMembersWithNames, setGroupMembersWithNames] = useState([]);
  const [loading, setLoading] = useState(true);
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
          }
        } catch (error) {
          console.error("Error fetching group details:", error);
        }
      };
      fetchGroupDetails();
    }
  }, [chatType, id]);

  const fetchUserNames = async () => {
    try {
      const usersData = await Promise.all(
        groupMembers.map(async (userID) => {
          const userDoc = await getDoc(doc(db, "users", userID));
          if (userDoc.exists()) {
            return { id: userID, name: userDoc.data().name };
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

  // const renderGroupMembers = ({ item }) => (
  //   <Text style={styles.groupMember}>{item}</Text>
  // );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push(`/chat/${id}`)}
      >
        <Ionicons name="arrow-back" size={24} color={theme.textColor} />
      </TouchableOpacity>

      <Image
        source={{
          uri:
            chatType === "group"
              ? "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg"
              : profileImage,
        }}
        style={styles.groupImage}
      />

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
            marginVertical: 20,
            backgroundColor: theme.searchContainerBG,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: theme.textColor, fontSize: wp("4.5%"), fontWeight: "bold" }}>
            Group Members
          </Text>
          {loading ? (
            <SkeletonHeader />
          ) : (
            <FlatList
              data={groupMembersWithNames}
              renderItem={({ item }) => (
                <View style={styles.groupMemberItem}>
                  <Image
                    source={{
                      uri: "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                    }}
                    style={styles.profileImage}
                  />
                  <Text
                    style={{ color: theme.textColor, fontSize: wp("4.4%"), marginLeft: 10 }}
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

      <TouchableOpacity style={styles.optionRow}>
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

