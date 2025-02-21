import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
  Modal,
} from "react-native";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import SkeletonMessage from "@/components/loaders/SkeletonMessage";
import SkeletonHeader from "@/components/loaders/SkeletonHeader";
import { useChatStyles } from "./index.styles";
import { formatTimestamp } from "@/utils/time";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";
import * as ImagePicker from "expo-image-picker";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [chatType, setChatType] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const styles = useChatStyles();
  const theme = useTheme();

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoadingData(true);

        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          const userInfo = userDoc.data();
          setUserData(userInfo);
          setChatType("person");
          setChatData(userInfo);
          console.log(userData);
        } else {
          console.log("Maybe its a group id");
        }

        const chatRef = doc(db, "chats", id);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          const chatInfo = chatSnap.data();
          setChatType(chatInfo.type);
          setChatData(chatInfo);
        } else {
          console.log("So it's not a group");
        }
      } catch (error) {
        console.error("Error fetching chat/user data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchChatData();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (!id || !chatType) return;
  
      setMessages([]);
      setLoadingMessages(true);
  
      const currentUserID = auth.currentUser.uid;
      let chatID = id;
  
      if (chatType === "person") {
        const chatUsers = [currentUserID, id].sort();
        chatID = chatUsers.join("_");
      }
  
      console.log("Fetching messages for chatID:", chatID);
  
      const chatRef = doc(db, "chats", chatID);
      const messagesRef = collection(chatRef, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"));
  
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (!snapshot.empty) {
          console.log("Messages received:", snapshot.docs.length);
  
          let deletedTimestamp = null;
          const chatSnap = await getDoc(chatRef);
  
          if (chatSnap.exists()) {
            const chatData = chatSnap.data();
  
            // **Check if `deletedBy` is an array and find the user's entry**
            if (Array.isArray(chatData.deletedBy)) {
              const userDeleteEntry = chatData.deletedBy.find(entry => entry.userId === currentUserID);
              if (userDeleteEntry) {
                deletedTimestamp = userDeleteEntry.timestamp;
              }
            }
  
            // **Reset unread count if it's not zero**
            if (chatData.unreadCount && chatData.unreadCount[currentUserID] !== 0) {
              const updatedUnreadCount = {
                ...chatData.unreadCount,
                [currentUserID]: 0,
              };
  
              await setDoc(chatRef, { unreadCount: updatedUnreadCount }, { merge: true });
            }
          }
  
          // **Process messages and filter based on deletedTimestamp**
          const messagesData = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              displayContent: doc.data().isUrl ? doc.data().imageUrl : doc.data().text || "",
            }))
            .filter((msg) =>
              deletedTimestamp ? msg.timestamp.toMillis() > deletedTimestamp.seconds * 1000 : true
            );
  
          if (chatType === "group") {
            const senderIDs = [...new Set(messagesData.map((msg) => msg.sender))];
  
            const senderPromises = senderIDs.map(async (senderID) => {
              const userDoc = await getDoc(doc(db, "users", senderID));
              return {
                id: senderID,
                name: userDoc.exists() ? userDoc.data().name : "Unknown",
              };
            });
  
            const senderResults = await Promise.all(senderPromises);
            const senderNameMap = senderResults.reduce((acc, sender) => {
              acc[sender.id] = sender.name;
              return acc;
            }, {});
  
            setMessages(
              messagesData.map((msg) => ({
                ...msg,
                senderName: senderNameMap[msg.sender] || "Unknown",
              }))
            );
          } else {
            setMessages(messagesData);
          }
        } else {
          console.log("No messages found.");
          setMessages([]);
        }
  
        setLoadingMessages(false);
      });
  
      return () => unsubscribe();
    }, [id, chatType])
  );
  
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsMenuVisible(false);
        setAttachmentMenuVisible(false);
      };
    }, [])
  );

  useEffect(() => {
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuVisible]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (chatType === "group") {
          router.push("/chat/screens/groups");
        } else {
          router.push("/chat");
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [chatType])
  );

  // const clearChat = async () => {
  //   try {
  //     const currentUserID = auth.currentUser.uid;
  //     let chatID = id;

  //     if (chatType === "person") {
  //       const chatUsers = [currentUserID, id].sort();
  //       chatID = chatUsers.join("_");
  //     }

  //     const userRef = doc(db, "users", currentUserID);
  //     await setDoc(
  //       userRef,
  //       {
  //         clearedChats: { [chatID]: true },
  //       },
  //       { merge: true }
  //     );

  //     console.log("Chat cleared successfully!");
  //   } catch (error) {
  //     console.error("Error clearing chat:", error);
  //   }
  // };

  const toggleAttachmentMenu = () => {
    setAttachmentMenuVisible(!attachmentMenuVisible);
  };

  const handleOutsideTap = () => {
    if (isMenuVisible || attachmentMenuVisible) {
      setAttachmentMenuVisible(false);
      setIsMenuVisible(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToCloudinary(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "chat_image.jpg",
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

      const fileData = await response.json();
      if (fileData.secure_url) {
        sendMessage(fileData.secure_url, true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const sendMessage = async (messageContent, isImage = false) => {
    setAttachmentMenuVisible(false);
    setIsMenuVisible(false);

    if (!messageContent.trim()) return;

    try {
      setNewMessage("");

      const currentUserID = auth.currentUser.uid;
      let chatID = id;

      if (chatType === "person") {
        const chatUsers = [currentUserID, id].sort();
        chatID = chatUsers.join("_");
      }

      const chatRef = doc(db, "chats", chatID);
      const messagesRef = collection(chatRef, "messages");

      const chatSnap = await getDoc(chatRef);
      let existingUnreadCount = 0;

      if (chatSnap.exists()) {
        const chatData = chatSnap.data();

        if (chatData.showChat?.[id] === false) {
          await updateDoc(chatRef, {
            [`showChat.${id}`]: true,
          });
        }

        if (chatType === "person") {
          existingUnreadCount = chatData.unreadCount?.[id] || 0;
        } else if (chatType === "group") {
          existingUnreadCount = chatData.unreadCount || {};
          Object.keys(existingUnreadCount).forEach((userID) => {
            existingUnreadCount[userID] = existingUnreadCount[userID] || 0;
          });
        }
      }

      const messageData = {
        sender: currentUserID,
        text: isImage ? "" : messageContent,
        imageUrl: isImage ? messageContent : null,
        isUrl: isImage,
        timestamp: Timestamp.now(),
      };

      await addDoc(messagesRef, messageData);

      const updatedChatData = {
        users:
          chatType === "group" ? chatData.users : [currentUserID, id].sort(),
        lastMessage: isImage ? "📷 Image" : messageContent,
        lastMessageTimestamp: Timestamp.now(),
      };

      if (chatType === "person") {
        updatedChatData.unreadCount = {
          ...chatSnap.data()?.unreadCount,
          [id]: existingUnreadCount + 1,
        };
      } else if (chatType === "group") {
        updatedChatData.unreadCount = existingUnreadCount;
      }

      await setDoc(chatRef, updatedChatData, { merge: true });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please enable microphone access.");
        setIsRecording(false);
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(",")[1];
        sendMessage("audio", base64Audio);
      };
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const playAudio = async (base64Audio) => {
    try {
      const audioUri = `data:audio/mp3;base64,${base64Audio}`;
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTap}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (chatType === "group") {
                router.replace("/chat/screens/groups");
              } else {
                router.replace("/chat");
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", width: "65%" }}
            disabled={loadingData}
            onPress={() => {
              router.push({
                pathname: `/chat/screens/UserDetails`,
                params: {
                  id: id,
                  name:
                    chatType === "group"
                      ? chatData?.groupName || "Unknown Group"
                      : userData?.name || "Unknown User",
                  profileImage:
                    userData?.profileImage ||
                    chatData?.groupImage ||
                    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                  chatType: chatType,
                },
              });
            }}
          >
            {loadingData ? (
              <SkeletonHeader />
            ) : chatData ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri:
                      chatType === "group"
                        ? chatData?.groupImage ||
                          "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg"
                        : userData?.profileImage ||
                          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                  }}
                  style={{
                    width: responsive.width(40),
                    height: responsive.height(40),
                    borderRadius: 20,
                    marginRight: responsive.width(10),
                  }}
                />
                <Text style={styles.userName}>
                  {chatType === "group" ? chatData?.groupName : userData?.name}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity>
              <Ionicons
                name="videocam-outline"
                size={24}
                color={theme.textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="call-outline" size={22} color={theme.textColor} />
            </TouchableOpacity>
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                onPress={() => setIsMenuVisible(!isMenuVisible)}
              >
                <MaterialIcons
                  name="more-vert"
                  size={24}
                  color={theme.textColor}
                />
              </TouchableOpacity>
              {isMenuVisible && (
                <View style={[styles.menu]}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      router.push({
                        pathname: `/chat/screens/UserDetails`,
                        params: {
                          id: id,
                          name:
                            chatType === "group"
                              ? chatData?.groupName || "Unknown Group"
                              : userData?.name || "Unknown User",
                          profileImage:
                            userData?.profileImage ||
                            "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                          chatType: chatType,
                        },
                      });
                    }}
                  >
                    <Text style={styles.menuText}>View Contact</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Search</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Media, Links & Docs</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Clear Chat</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={loadingMessages ? Array(5).fill({}) : messages}
            keyExtractor={(item, index) =>
              loadingMessages ? index.toString() : item.id
            }
            renderItem={({ item, index }) =>
              loadingMessages ? (
                <SkeletonMessage isSender={index % 2 === 0} />
              ) : (
                <View>
                  <View
                    style={
                      item.sender === auth.currentUser.uid
                        ? styles.sentMessage(item.isUrl)
                        : styles.receivedMessage(item.isUrl)
                    }
                  >
                    {chatType === "group" &&
                      item.senderName &&
                      item.sender !== auth.currentUser.uid && (
                        <Text
                          style={{
                            color: theme.groupMessageSender,
                            fontSize: responsive.fontSize(14),
                            marginBottom: responsive.height(2),
                            fontWeight: 700,
                          }}
                        >
                          {item.senderName}
                        </Text>
                      )}
                    {item.isUrl ? (
                      <TouchableOpacity
                        onPress={() => openImageModal(item.displayContent)}
                      >
                        <Image
                          source={{ uri: item.displayContent }}
                          style={{
                            width: responsive.width(200),
                            height: responsive.height(200),
                            borderRadius: 10,
                            borderTopRightRadius:
                              item.sender === auth.currentUser.uid ? 20 : 10,
                            borderTopLeftRadius:
                              item.sender === auth.currentUser.uid ? 10 : 20,
                            zIndex: 1,
                          }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.messageText}>{item.text}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.timestamp,
                      item.sender === auth.currentUser.uid
                        ? {
                            alignSelf: "flex-end",
                            marginRight: responsive.width(15),
                          }
                        : {
                            alignSelf: "flex-start",
                            marginLeft: responsive.width(15),
                          },
                    ]}
                  >
                    {formatTimestamp(item.timestamp)}
                  </Text>
                </View>
              )
            }
            contentContainerStyle={{ paddingBottom: responsive.height(10) }}
            inverted
          />
        </View>

        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={closeImageModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.9)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: "90%",
                    height: "80%",
                    resizeMode: "contain",
                    borderRadius: 10,
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {attachmentMenuVisible && (
          <View style={styles.attachmentMenu}>
            <View style={styles.attachmentRow}>
              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => console.log("Open Camera")}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="camera" size={30} color="white" />
                </View>
                <Text style={styles.attachmentText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={pickImage}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="image" size={30} color="white" />
                </View>
                <Text style={styles.attachmentText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => console.log("Share Location")}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="location" size={30} color="white" />
                </View>
                <Text style={styles.attachmentText}>Location</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => console.log("Share Contact")}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="person" size={30} color="white" />
                </View>
                <Text style={styles.attachmentText}>Contact</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.attachmentRow}>
              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => console.log("Select Document")}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="document" size={30} color="white" />
                </View>
                <Text style={styles.attachmentText}>Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => console.log("Record Audio")}
              >
                <View style={styles.iconBox}>
                  <Ionicons name="mic" size={30} color="white" />
                </View>
                <Text style={styles.attachmentText}>Audio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => console.log("Create Poll")}
              >
                <View style={styles.iconBox}>
                  <FontAwesome5 name="poll" size={30} color="white" />
                </View>
                <Text style={styles.attachmentText}>Poll</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={toggleAttachmentMenu}>
                <Ionicons name="attach" size={24} color={theme.textColor} />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Type a message"
                placeholderTextColor={theme.lastMessage}
                value={newMessage}
                onChangeText={(text) => {
                  setNewMessage(text);
                  setIsRecording(false);
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  if (newMessage.trim()) {
                    sendMessage(newMessage, false);
                  } else if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
                style={styles.sendOrRecordButton}
              >
                {newMessage.trim() ? (
                  <Ionicons name="send" size={24} color={theme.textColor} />
                ) : isRecording ? (
                  <Ionicons name="stop-circle" size={30} color="red" />
                ) : (
                  <Ionicons name="mic" size={30} color={theme.textColor} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
