import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ChatListLoader() {
  return (
    <View style={styles.chatItem}>
      <Skeleton width={50} height={50} radius="round" />
      <View style={styles.chatTextContainer}>
        <Skeleton width={"60%"} height={20} radius={5} />
        <Skeleton
          width={"80%"}
          height={16}
          radius={5}
          style={{ marginTop: 5 }}
        />
      </View>
      <Skeleton width={40} height={12} radius={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "white",
  },
  lastMessage: {
    fontSize: wp("3.9%"),
    color: "#888",
  },
  timestampContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  timestamp: {
    fontSize: wp("3.3%"),
    color: "#aaa",
    marginTop: 10,
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "white",
    fontSize: wp("3.3%"),
    fontWeight: "bold",
  },
});
