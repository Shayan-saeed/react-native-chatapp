import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut, updateEmail, updateProfile } from "firebase/auth";
import { auth, db } from "../../../config/firebaseConfig";
import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useChatStyles } from "./profile.styles";
import { useTheme } from "@/components/theme/ThemeContext";
import { removeToken } from "@/utils/authStorage";
import { useFocusEffect } from "@react-navigation/native";
export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const currentUserID = auth.currentUser.uid;
  const [loading, setLoading] = useState(false);
  const styles = useChatStyles();
  const theme = useTheme();

  useEffect(() => {
    if (!currentUserID) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUserID));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setEditedName(data.name || "");
          setEditedEmail(data.email || "");
        } else {
          console.error("User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUserID]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await removeToken();
      setLoading(false);
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    if (!editedName.trim() || !editedEmail.trim()) {
      setLoading(false);
      Alert.alert("Error", "Name and email cannot be empty.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (user.displayName === editedName && user.email === editedEmail) {
        setLoading(false);
        Alert.alert("Error", "No changes made.");
        setIsEditing(false);
        return;
      }

      await updateProfile(user, {
        displayName: editedName,
      });

      await updateEmail(user, editedEmail);

      const userRef = doc(db, "users", currentUserID);
      await updateDoc(userRef, {
        name: editedName,
        email: editedEmail,
      });

      setUserData({ ...userData, name: editedName, email: editedEmail });
      setLoading(false);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Update Failed", "Could not update profile.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setIsEditing(false);
        router.push("/chat");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {router.back(), setIsEditing(false);}}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.profilePicContainer}>
        <Image
          source={{
            uri:
              userData?.profileImage ||
              "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
          }}
          style={styles.profilePic}
        />
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
            />
          ) : (
            <Text style={styles.value}>{userData?.name || "Loading..."}</Text>
          )}
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedEmail}
              onChangeText={setEditedEmail}
            />
          ) : (
            <Text style={styles.value}>{userData?.email || "Loading..."}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={isEditing ? handleSaveChanges : handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons
            name={isEditing ? "save-outline" : "log-out-outline"}
            size={24}
            color={theme.textColor}
          />
        )}

        <Text style={styles.logoutText}>
          {isEditing ? "Save Changes" : "Logout"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
