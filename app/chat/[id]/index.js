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

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { userData, chatType, chatData, loadingData } = useChatData(id);
  const { messages, loadingMessages } = useMessages(id, chatType);
  const [newMessage, setNewMessage] = useState("");
  const { sendMessage, sentLoading } = useSendMessage(id, chatType, setNewMessage);
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [selectedImage, setSelectedImage] = useState(null);
  const styles = useChatStyles();
  const theme = useTheme();

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
        sendMessage("image", fileData.secure_url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Please enable microphone access.");
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
      const { audioUrl, waveformUrl, duration } = await uploadToCloudinary(uri);

      if (audioUrl) {
        sendMessage("audio", audioUrl, waveformUrl, duration); 
    }
    } catch (error) {
      console.error("Error stopping recording:", error);
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

        {attachmentMenuVisible && <AttachmentMenu pickImage={pickImage} />}

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
                    sendMessage("text", newMessage);
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
