import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MainScreenHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.username}>ChatApp</Text>
      <TouchableOpacity onPress={() => router.push("/chat/screens/profile")}>
        <Feather name="user" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  username: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    color: "#fff",
  },
});
