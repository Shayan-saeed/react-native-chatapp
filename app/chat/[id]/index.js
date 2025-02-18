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
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import SkeletonMessage from "@/components/loaders/SkeletonMessage";
import SkeletonHeader from "@/components/loaders/SkeletonHeader";
import styles from "./index.styles";
import { formatTimestamp } from "@/utils/time";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

      const messagesRef = collection(db, "chats", chatID, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (!snapshot.empty) {
          console.log("Messages received:", snapshot.docs.length);

          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (chatType === "group") {
            const senderIDs = [
              ...new Set(messagesData.map((msg) => msg.sender)),
            ];

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

            const updatedMessages = messagesData.map((msg) => ({
              ...msg,
              senderName: senderNameMap[msg.sender] || "Unknown",
            }));

            setMessages(updatedMessages);
          } else {
            setMessages(messagesData);
          }
        } else {
          console.log("No messages found.");
          setMessages([]);
        }

        setLoadingMessages(false);

        const chatRef = doc(db, "chats", chatID);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          if (
            chatData.unreadCount &&
            chatData.unreadCount[currentUserID] !== 0
          ) {
            const updatedUnreadCount = {
              ...chatData.unreadCount,
              [currentUserID]: 0,
            };

            await setDoc(
              chatRef,
              { unreadCount: updatedUnreadCount },
              { merge: true }
            );
          }
        }
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

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

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
        text: newMessage,
        timestamp: Timestamp.now(),
      };

      await addDoc(messagesRef, messageData);

      const updatedChatData = {
        users:
          chatType === "group" ? chatData.users : [currentUserID, id].sort(),
        lastMessage: newMessage,
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

  const handleOpenProfile = () => {};

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
            <Ionicons name="arrow-back" size={24} color="white" />
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
                        ? "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg"
                        : userData?.profileImage ||
                          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: "white", fontSize: wp("4.4%") }}>
                  {chatType === "group" ? chatData?.groupName : userData?.name}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity>
              <Ionicons name="videocam-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="call-outline" size={22} color="white" />
            </TouchableOpacity>
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                onPress={() => setIsMenuVisible(!isMenuVisible)}
              >
                <MaterialIcons name="more-vert" size={24} color="white" />
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
                        ? styles.sentMessage
                        : styles.receivedMessage
                    }
                  >
                    {chatType === "group" && item.senderName && (
                      <Text
                        style={{ color: "#ccc", fontSize: wp("3.3%"), marginBottom: 2 }}
                      >
                        {item.senderName}
                      </Text>
                    )}
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                  <Text
                    style={[
                      styles.timestamp,
                      item.sender === auth.currentUser.uid
                        ? { alignSelf: "flex-end", marginRight: 15 }
                        : { alignSelf: "flex-start", marginLeft: 15 },
                    ]}
                  >
                    {formatTimestamp(item.timestamp)}
                  </Text>
                </View>
              )
            }
            contentContainerStyle={{ paddingBottom: 10 }}
            inverted
          />
        </View>

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
                onPress={() => console.log("Open Gallery")}
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
                <Ionicons name="attach" size={24} color="#888" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Type a message"
                placeholderTextColor="#888"
                value={newMessage}
                onChangeText={(text) => {
                  setNewMessage(text);
                  setIsRecording(false);
                }}
              />

              <TouchableOpacity
                onPress={
                  newMessage.trim()
                    ? sendMessage
                    : isRecording
                    ? stopRecording
                    : startRecording
                }
                style={styles.sendOrRecordButton}
              >
                {newMessage.trim() ? (
                  <Ionicons name="send" size={24} color="white" />
                ) : isRecording ? (
                  <Ionicons name="stop-circle" size={30} color="red" />
                ) : (
                  <Ionicons name="mic" size={30} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

