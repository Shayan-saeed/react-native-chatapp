import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";


export default function MainScreenHeader() {
  const theme = useTheme();
  return (
    <View style={[styles.header, {borderBottomColor: theme.borderBottomColor}]}>
      <Text style={[styles.username, {color: theme.textColor}]}>ChatApp</Text>
      <TouchableOpacity onPress={() => router.push("/chat/screens/profile")}>
        <Feather name="user" size={28} color={theme.textColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: responsive.height(10),
    borderBottomWidth: 1,
  },
  username: {
    fontSize: responsive.fontSize(20),
    fontWeight: "bold",
  },
});
