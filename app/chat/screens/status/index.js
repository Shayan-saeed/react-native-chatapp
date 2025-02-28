import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  Animated,
  BackHandler,
} from "react-native";
import { useChatStyles } from "./status.styles";
import MainScreenHeader from "@/components/ui/MainScreenHeader";
import {
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const StatusItem = ({ imageUrl, name, time, onPress }) => {
  const styles = useChatStyles();
  return (
    <TouchableOpacity onPress={onPress} style={styles.statusItemContainer}>
      <Image source={{ uri: imageUrl }} style={styles.statusProfileImage} />
      <View style={styles.statusTextContainer}>
        <Text style={styles.statusName}>{name}</Text>
        <Text style={styles.statusTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function StatusScreen() {
  const styles = useChatStyles();
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [myStatuses, setMyStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const currentUserID = auth.currentUser.uid;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchStatuses();
    deleteExpiredStatuses();
    fetchMyStatuses();
  }, []);

  useEffect(() => {
    if (!currentUserID) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUserID));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
        } else {
          console.error("User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUserID]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const fetchStatuses = async () => {
    try {
      const statusRef = collection(db, "status");

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const q = query(
        statusRef,
        where("timestamp", ">", twentyFourHoursAgo),
        where("userId", "!=", currentUserID),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      const fetchedStatuses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          profileImage: data.profileImage,
          name: data.name,
          time: formatTimestamp(data.timestamp),
          imageUrl: data.imageUrl,
        };
      });

      setStatuses(fetchedStatuses);
      console.log(statuses);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchMyStatuses = async () => {
    try {
      const statusRef = collection(db, "status");
      const q = query(
        statusRef,
        where("userId", "==", currentUserID),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      const fetchedStatuses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          profileImage: data.profileImage,
          name: data.name,
          time: formatTimestamp(data.timestamp),
          imageUrl: data.imageUrl,
        };
      });

      setMyStatuses(fetchedStatuses);
    } catch (error) {
      console.error("Error fetching my statuses:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Just now";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to allow access to the gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      await uploadImage(imageUri);
    }
  };

  const handleStatusPress = (status) => {
    setSelectedStatus(status);
    progressAnimation.setValue(0);
    setIsPaused(false);

    timeoutRef.current = setTimeout(() => {
      setSelectedStatus(null);
    }, 5000);

    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  };

  const handleLongPress = () => {
    setIsPaused(true);
    progressAnimation.stopAnimation();
    clearTimeout(timeoutRef.current);
  };

  const handlePressOut = () => {
    if (isPaused) {
      setIsPaused(false);
      const remainingTime = 5000 * (1 - progressAnimation._value);
      timeoutRef.current = setTimeout(() => {
        setSelectedStatus(null);
      }, remainingTime);

      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: remainingTime,
        useNativeDriver: false,
      }).start();
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "status.jpg",
      });
      data.append("upload_preset", "user_uploads");
      data.append("cloud_name", "dir9vradu");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dir9vradu/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      if (result.secure_url) {
        await saveStatus(result.secure_url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const saveStatus = async (imageUrl) => {
    try {
      const statusRef = collection(db, "status");
      const newStatus = {
        userId: currentUserID,
        name: userData?.name || "Unknown",
        profileImage:
          userData?.profileImage ||
          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
      };

      await addDoc(statusRef, newStatus);

      setStatus({
        userId: currentUserID,
        name: userData?.name || "Unknown",
        profileImage:
          userData?.profileImage ||
          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        imageUrl: imageUrl,
        time: "Just now",
      });
    } catch (error) {
      console.error("Error saving status:", error);
    }
  };

  const deleteExpiredStatuses = async () => {
    try {
      const statusRef = collection(db, "status");
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const q = query(statusRef, where("timestamp", "<=", twentyFourHoursAgo));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting expired statuses:", error);
    }
  };

  // const deleteStatus = async () => {
  //   try {
  //     if (selectedStatus && selectedStatus.id) {
  //       const userStatusRef = doc(db, "status", currentUserID);
  //       const statusDocRef = doc(userStatusRef, "statuses", selectedStatus.id);
  //       await deleteDoc(statusDocRef);

  //       setSelectedStatus(null);
  //       fetchMyStatuses(); // Refresh statuses after deletion
  //     }
  //   } catch (error) {
  //     console.error("Error deleting status:", error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <MainScreenHeader headerName="Status" />
      <View style={styles.addStatusContainer}>
        <TouchableOpacity
          onPress={
            myStatuses.length > 0
              ? () => handleStatusPress(myStatuses[0])
              : pickImage
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image
            source={{
              uri:
                userData?.profileImage ||
                "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
            }}
            style={styles.profileImage}
          />
          {myStatuses.length < 1 ? (
            <AntDesign
              name="pluscircle"
              size={22}
              color="#1E90FF"
              style={{ position: "absolute", right: 8, bottom: -5 }}
            />
          ) : null}

          <View style={styles.addStatusView}>
            <Text style={styles.heading}>My status</Text>
            <Text style={styles.text}>
              {myStatuses.length > 0
                ? "Tap to view status update"
                : "Tap to add status update"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.recentUpdatesHeader}>Recent updates</Text>
      {statuses.length > 0 ? (
        <FlatList
          data={statuses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StatusItem {...item} onPress={() => handleStatusPress(item)} />
          )}
        />
      ) : (
        <Text style={styles.noStatusText}>No recent updates</Text>
      )}
      <Modal visible={!!selectedStatus} transparent animationType="fade">
        <View style={styles.modalContainer}>
          {selectedStatus && (
            <>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                      }
                      setSelectedStatus(null);
                    }}
                    style={styles.backButton}
                  >
                    <AntDesign name="arrowleft" size={24} color="white" />
                  </TouchableOpacity>
                  <View style={styles.userInfoContainer}>
                    <Image
                      source={{ uri: selectedStatus.profileImage }}
                      style={styles.modalProfileImage}
                    />
                    <View>
                      <Text style={styles.modalName}>
                        {selectedStatus.name}
                      </Text>
                      <Text style={styles.modalTime}>
                        {selectedStatus.time}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.infoButton} onPress={toggleMenu}>
                  <AntDesign name="infocirlceo" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <Modal visible={isMenuVisible} transparent animationType="fade">
                <TouchableOpacity
                  style={styles.menuOverlay}
                  onPress={() => setIsMenuVisible(false)}
                >
                  <View style={styles.menuContainer}>
                    {selectedStatus?.name === userData?.name && (
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          // deleteStatus();
                          setIsMenuVisible(false);
                        }}
                      >
                        <Text style={styles.menuText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              </Modal>
              <TouchableOpacity
                onLongPress={handleLongPress}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={{ flex: 1 }}
              >
                <Image
                  source={{ uri: selectedStatus.imageUrl }}
                  style={styles.fullScreenImage}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
      <TouchableOpacity style={styles.floatingButton} onPress={pickImage}>
        <MaterialIcons name="add-a-photo" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
