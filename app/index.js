import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);

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
    return <ActivityIndicator size="large" />;
  }

  return <View />;
}
