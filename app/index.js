import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/components/theme/ThemeContext";

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        
        if (token) {
          router.replace("/chat");
        } else {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              router.replace("/chat");
            } else {
              router.replace("/auth/welcome");
            }
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colorMode === "dark" ? "#fff" : "#000"} />
      </View>
    );
  }

  return <View style={{ flex: 1, backgroundColor: theme.colorMode === "dark" ? "#000" : "#fff" }} />;
}
