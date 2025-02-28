import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
  Modal,
  Text,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import ChatHeader from "@/components/chat/ChatHeader";
import { useChatStyles } from "./index.styles";
import { useTheme } from "@/components/theme/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import MessageList from "@/components/chat/MessageList";
import AttachmentMenu from "@/components/chat/AttachmentMenu";
import useChatData from "@/hooks/useChatData";
import useMessages from "@/hooks/useMessages";
import useSendMessage from "@/hooks/useSendMessage";
import { db, auth } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { userData, chatType, chatData, loadingData } = useChatData(id);
  const { messages, loadingMessages } = useMessages(id, chatType);
  const [newMessage, setNewMessage] = useState("");
  const [sentLoading, setSentLoading] = useState(false);
  const { sendMessage } = useSendMessage(
    id,
    chatType,
    setNewMessage,
    setSentLoading
  );
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingInterval = useRef(null);
  const micScale = useRef(new Animated.Value(1)).current;
  const micBackground = useRef(new Animated.Value(0)).current;
  const [isPaused, setIsPaused] = useState(false);
  const [isLeft, setIsLeft] = useState(false);

  const styles = useChatStyles();
  const theme = useTheme();

  useEffect(() => {
    setIsLeft(false);
    const checkIfUserLeft = async () => {
      try {
        const currentUserID = auth.currentUser?.uid;

        if (!id || !chatType) {
          console.log("Missing chatID or chatType");
          return;
        }

        if (chatType === "group") {
          const chatRef = doc(db, "chats", id);
          const chatSnap = await getDoc(chatRef);

          if (chatSnap.exists()) {
            const chatData = chatSnap.data();

            if (chatData.leftUsers?.includes(currentUserID)) {
              setIsLeft(true);
            } else {
              setIsLeft(false);
            }
          } else {
            console.log("Chat document does not exist");
          }
        }
      } catch (error) {
        console.error("Error checking if user left:", error);
      }
    };

    checkIfUserLeft();
  }, [chatType, id]);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

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
        handleCancelRecording();
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
    setAttachmentMenuVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSentLoading(true);
      uploadImageToCloudinary(result.assets[0].uri);
    }
  };

  const takePictureFromCamera = async () => {
    setAttachmentMenuVisible(false);
    if (cameraPermission) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSentLoading(true);
        uploadImageToCloudinary(result.assets[0].uri);
      }
    } else {
      console.log("Camera permission not granted");
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
        sendMessage("image", fileData.secure_url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      Animated.parallel([
        Animated.timing(micScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(micBackground, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Please enable microphone access.");
        setIsRecording(false);
        clearInterval(recordingInterval.current);
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsPaused(false);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
      clearInterval(recordingInterval.current);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(recordingInterval.current);
      setSentLoading(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const { audioUrl, waveformUrl, duration } = await uploadToCloudinary(uri);

      if (audioUrl) {
        sendMessage("audio", audioUrl, waveformUrl, duration);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    } finally {
      Animated.parallel([
        Animated.timing(micScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(micBackground, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const uploadToCloudinary = async (fileUri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      type: "audio/mpeg",
      name: "recording.mp3",
    });
    formData.append("upload_preset", "user_uploads");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dir9vradu/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const audioUrl = data.secure_url;
      const publicId = data.public_id;
      const duration = data.duration;

      // Generate waveform URL using Cloudinary transformations
      const waveformUrl = `https://res.cloudinary.com/dir9vradu/video/upload/c_scale,h_250,w_700/fl_waveform,co_white,b_transparent/${publicId}.png`;

      return { audioUrl, waveformUrl, duration };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return { audioUrl: null, waveformUrl: null, duration: null };
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const formatDuration = (duration) => {
    if (!duration) return "0:00";

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleRecordButtonClick = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleStopRecording = async () => {
    await stopRecording();
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    clearInterval(recordingInterval.current);
    Animated.parallel([
      Animated.timing(micScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(micBackground, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    if (recording) {
      recording.stopAndUnloadAsync();
      setRecording(null);
    }
  };

  const pauseRecording = async () => {
    if (recording) {
      await recording.pauseAsync();
      setIsPaused(true);
      clearInterval(recordingInterval.current);
    }
  };

  const resumeRecording = async () => {
    if (recording) {
      await recording.startAsync();
      setIsPaused(false);
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTap}>
      <View style={styles.container}>
        <ChatHeader
          chatData={chatData}
          userData={userData}
          chatType={chatType}
          loadingData={loadingData}
          id={id}
          isMenuVisible={isMenuVisible}
          setIsMenuVisible={setIsMenuVisible}
        />
        <MessageList
          id={id}
          messages={messages}
          loadingMessages={loadingMessages}
          sentLoading={sentLoading}
          chatType={chatType}
          openImageModal={openImageModal}
        />
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
          <AttachmentMenu
            pickImage={pickImage}
            takePictureFromCamera={takePictureFromCamera}
          />
        )}

        {isLeft ? (
          <View
            style={{
              padding: 10,
              backgroundColor: theme.backgroundColor,
              borderRadius: 8,
              margin: 10,
            }}
          >
            <Text
              style={{
                color: "#a0a0a0",
                fontSize: 14,
                textAlign: "center",
                flexWrap: "wrap",
              }}
            >
              You can't send messages to this group because you're no longer a
              member
            </Text>
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.inputContainer,
                  isRecording
                    ? { backgroundColor: "#1E90FF" }
                    : { backgroundColor: theme.searchContainerBG },
                ]}
              >
                {isRecording ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={handleCancelRecording}>
                      <Ionicons
                        name="trash-bin"
                        size={24}
                        color={theme.textColor}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={isPaused ? resumeRecording : pauseRecording}
                      style={{ marginLeft: 10 }}
                    >
                      <Ionicons
                        name={isPaused ? "play" : "pause"}
                        size={24}
                        color={theme.textColor}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={toggleAttachmentMenu}>
                    <Ionicons name="attach" size={24} color={theme.textColor} />
                  </TouchableOpacity>
                )}

                {isRecording ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: theme.textColor, fontSize: 18 }}>
                      {formatDuration(recordingDuration)}
                    </Text>
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor={theme.lastMessage}
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                  />
                )}

                {newMessage.trim() ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSentLoading(true), sendMessage("text", newMessage);
                    }}
                  >
                    <Ionicons name="send" size={24} color={theme.textColor} />
                  </TouchableOpacity>
                ) : (
                  <Animated.View>
                    <TouchableOpacity
                      onPress={handleRecordButtonClick}
                      style={styles.sendOrRecordButton}
                    >
                      <Animated.View
                        style={{ transform: [{ scale: micScale }] }}
                      >
                        <Ionicons
                          name={isRecording ? "arrow-up" : "mic"}
                          size={30}
                          color={theme.textColor}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
