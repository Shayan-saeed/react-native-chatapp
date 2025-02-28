import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

const { height } = Dimensions.get("window");

const AddUserBottomSheet = ({ visible, onClose, userEmail, setUserEmail, loading, setLoading, handleAddUser }) => {
  const theme = useTheme();
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : height, { duration: 300 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > height * 0.1) {
        translateY.value = withTiming(height, { duration: 300 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withTiming(0, { duration: 300 });
      }
    });

  return (
    <Animated.View style={[styles.backdrop, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View style={[styles.sheet, { backgroundColor: theme.borderBottomColor }]}>
          <View style={styles.dragIndicator} />
          <Text style={[styles.title, { fontSize: responsive.fontSize(18), color: theme.textColor }]}>
            Add User
          </Text>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.searchContainerBG, paddingHorizontal: responsive.width(12) },
            ]}
          >
            <Ionicons name="mail-outline" size={20} color="gray" style={{ marginRight: responsive.width(8) }} />
            <TextInput
              style={[styles.input, { fontSize: responsive.fontSize(16), color: theme.textColor }]}
              placeholder="Enter user email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.lastMessage}
              value={userEmail}
              onChangeText={setUserEmail}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAddUser}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { fontSize: responsive.fontSize(16) }]}>
              {loading ? "Adding..." : "Add User"}
            </Text>
          </TouchableOpacity>
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

export default AddUserBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height,
    justifyContent: "flex-end",
    zIndex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "gray",
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: responsive.height(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
    paddingVertical: responsive.height(10),
    marginBottom: responsive.height(20),
  },
  input: {
    flex: 1,
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsive.height(12),
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
});
