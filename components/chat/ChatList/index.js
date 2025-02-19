import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import { router } from "expo-router";
import { formatTimestamp } from "@/utils/time";
import { useChatStyles } from "./chatlist.styles";

export default function ChatList({
  items,
  setSelectedData,
  setIsProfileModalVisible,
}) {

  const styles = useChatStyles();

  return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => {
                setSelectedData(item);
                setIsProfileModalVisible(true);
              }}
            >
              <Image
                source={{
                  uri:
                    item.profileImage ||
                    "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg",
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>

            <View style={styles.chatTextContainer}>
              <Text style={styles.chatName}>
                {item.name ? item.name : item.groupName}
              </Text>
              <Text style={styles.lastMessage}>
                {item.lastMessage && item.lastMessage.length > 25
                  ? item.lastMessage.slice(0, 25) + "..."
                  : item.lastMessage || "No messages yet"}
              </Text>
            </View>
            <View style={styles.timestampContainer}>
              <Text style={styles.timestamp}>
                {formatTimestamp(
                  item.timestamp ? item.timestamp : item.lastMessageTimestamp
                )}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
  );
}
