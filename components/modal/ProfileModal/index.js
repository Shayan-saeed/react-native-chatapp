import React, {useState} from "react";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "./profilemodal.styles"

export default function ProfileModal({
  isProfileModalVisible,
  selectedData,
  setIsProfileModalVisible,
}) {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setIsProfileModalVisible(false);
    setTimeout(() => setShowModal(false), 300);
  };

  return (
    <View>
      {isProfileModalVisible && (
        <NativeViewGestureHandler disallowInterruption={true}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isProfileModalVisible}
            onRequestClose={closeModal}
            statusBarTranslucent={true}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setIsProfileModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <ImageBackground
                  source={{
                    uri:
                      selectedData.profileImage ||
                      "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg",
                  }}
                  style={styles.modalImage}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.userName}>
                      {selectedData.name
                        ? selectedData.name
                        : selectedData.groupName}
                    </Text>
                  </View>
                </ImageBackground>

                <View style={styles.iconsRow}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push(`/chat/${selectedData?.id}`)}
                  >
                    <Ionicons
                      name="chatbubbles-outline"
                      size={24}
                      color="#1E90FF"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="call-outline" size={24} color="#1E90FF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                      name="videocam-outline"
                      size={24}
                      color="#1E90FF"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                      name="information-circle-outline"
                      size={24}
                      color="#1E90FF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </NativeViewGestureHandler>
      )}
    </View>
  );
}
