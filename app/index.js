import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { auth } from "./config/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { router } from "expo-router";

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.replace("/chat");
      } else {
        router.replace("/auth/welcome");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View>
      <Text>Welcome</Text>
      {user && <Button title="Logout" onPress={() => signOut(auth)} />}
    </View>
  );
}
