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
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import GestureRecognizer from "react-native-swipe-gestures";
import StatusListLoader from "@/components/loaders/StatusListLoader";

const StatusItem = ({
  profileImage,
  name,
  time,
  imageUrl,
  onPress,
  statusCount,
}) => {
  const styles = useChatStyles();
  const dashGap = Math.max(2, 10 / statusCount);
  const borderStyle = {
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderRadius: 25,
    ...(statusCount > 1 && {
      borderStyle: "dashed",
      borderRadius: 25,
      borderWidth: 2,
      borderColor: "#1E90FF",
      dashGap: dashGap,
    }),
  };
  return (
    <TouchableOpacity
      onPress={() => onPress({ imageUrl, profileImage, name, time })}
      style={styles.statusItemContainer}
    >
      <Image
        source={{ uri: profileImage }}
        style={[styles.statusProfileImage, borderStyle]}
      />
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
  const [statuses, setStatuses] = useState([]);
  const [myStatuses, setMyStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const currentUserID = auth.currentUser.uid;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const [viewingUserStatuses, setViewingUserStatuses] = useState([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

    const unsubscribe = onSnapshot(collection(db, "status"), (snapshot) => {
      fetchStatuses();
    });
    return () => unsubscribe();
  }, [currentUserID]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const statusRef = collection(db, "status");
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const querySnapshot = await getDocs(statusRef);

      const fetchedStatuses = [];

      for (const docSnapshot of querySnapshot.docs) {
        if (docSnapshot.id !== currentUserID) {
          const userStatusRef = doc(db, "status", docSnapshot.id);
          const statusesCollectionRef = collection(userStatusRef, "statuses");
          const q = query(
            statusesCollectionRef,
            where("timestamp", ">", twentyFourHoursAgo),
            orderBy("timestamp", "desc")
          );
          const statusQuerySnapshot = await getDocs(q);

          const statusCount = statusQuerySnapshot.docs.length;

          if (!statusQuerySnapshot.empty) {
            const latestStatus = statusQuerySnapshot.docs[0].data();
            fetchedStatuses.push({
              id: docSnapshot.id,
              profileImage: docSnapshot.data().profileImage,
              name: docSnapshot.data().name,
              time: formatTimestamp(latestStatus.timestamp),
              imageUrl: latestStatus.imageUrl,
              statusCount: statusCount,
            });
          }
        }
      }
      setStatuses(fetchedStatuses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyStatuses = async () => {
    try {
      const userStatusRef = doc(db, "status", currentUserID);
      const statusesCollectionRef = collection(userStatusRef, "statuses");
      const q = query(statusesCollectionRef, orderBy("timestamp", "desc"));

      const querySnapshot = await getDocs(q);

      const fetchedStatuses = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          imageUrl: data.imageUrl,
          time: formatTimestamp(data.timestamp),
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

  const handleStatusPress = async (status, isCurrentUser = false) => {
    try {
      const userStatusRef = doc(db, "status", status.id);
      const statusesCollectionRef = collection(userStatusRef, "statuses");
      const q = query(statusesCollectionRef, orderBy("timestamp", "asc"));
      const querySnapshot = await getDocs(q);

      const fetchedStatuses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        imageUrl: doc.data().imageUrl,
        time: formatTimestamp(doc.data().timestamp),
      }));

      if (fetchedStatuses.length > 0) {
        setViewingUserStatuses(fetchedStatuses);
        setCurrentStatusIndex(0);
        setSelectedStatus({
          imageUrl: fetchedStatuses[0].imageUrl,
          profileImage: status.profileImage,
          name: status.name,
          time: fetchedStatuses[0].time,
          id: fetchedStatuses[0].id,
        });
      } else {
        Alert.alert("No Status Found", "This user has no status updates.");
      }

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
    } catch (error) {
      console.error("Error fetching user statuses:", error);
    }
  };

  const navigateStatus = (direction) => {
    let newIndex = currentStatusIndex + direction;
    if (newIndex < 0) {
      newIndex = viewingUserStatuses.length - 1;
    } else if (newIndex >= viewingUserStatuses.length) {
      newIndex = 0;
    }
    setCurrentStatusIndex(newIndex);
    setSelectedStatus({
      imageUrl: viewingUserStatuses[newIndex].imageUrl,
      profileImage: selectedStatus.profileImage,
      name: selectedStatus.name,
      time: viewingUserStatuses[newIndex].time,
      id: viewingUserStatuses[newIndex].id,
    });
    progressAnimation.setValue(0);
    setIsPaused(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    clearTimeout(timeoutRef.current);
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
      const userStatusRef = doc(db, "status", currentUserID);
      // const statusRef = collection(db, "status");

      const userStatusDoc = await getDoc(userStatusRef);
      if (!userStatusDoc.exists()) {
        await setDoc(userStatusRef, {
          userId: currentUserID,
          name: userData?.name || "Unknown",
          profileImage:
            userData?.profileImage ||
            "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        });
      }

      const statusesCollectionRef = collection(userStatusRef, "statuses");
      await addDoc(statusesCollectionRef, {
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
      });

      fetchMyStatuses();
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

  return (
    <View style={styles.container}>
      <MainScreenHeader headerName="Status" />
      <View style={styles.addStatusContainer}>
        <TouchableOpacity
          onPress={
            myStatuses.length > 0
              ? () =>
                  handleStatusPress(
                    {
                      id: currentUserID,
                      profileImage: userData?.profileImage,
                      name: userData?.name,
                    },
                    true
                  )
              : pickImage
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View>
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
                style={{ position: "absolute", right: 2, bottom: 0 }}
              />
            ) : null}
          </View>

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
      {loading ? (
        <StatusListLoader />
      ) : statuses.length > 0 ? (
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
        <GestureRecognizer
          onSwipeDown={() => {
            setViewingUserStatuses();
            setCurrentStatusIndex(0);
            setSelectedStatus(null);
            setIsPaused(false);
            progressAnimation.setValue(0);
            clearTimeout(timeoutRef.current);
          }}
          style={{ flex: 1 }}
        >
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
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={toggleMenu}
                  >
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
                  style={{ flex: 1, position: "relative", zIndex: 1 }}
                >
                  <Image
                    source={{ uri: selectedStatus.imageUrl }}
                    style={styles.fullScreenImage}
                  />
                  {viewingUserStatuses.length > 1 && (
                    <>
                      <TouchableOpacity
                        style={styles.navigationButtonLeft}
                        onPress={() => navigateStatus(-1)}
                      />
                      <TouchableOpacity
                        style={styles.navigationButtonRight}
                        onPress={() => navigateStatus(1)}
                      />
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </GestureRecognizer>
      </Modal>
      <TouchableOpacity style={styles.floatingButton} onPress={pickImage}>
        <MaterialIcons name="add-a-photo" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
