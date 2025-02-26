import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/components/theme/ThemeContext";
import { router } from "expo-router";
import SkeletonHeader from "@/components/loaders/SkeletonHeader";
import responsive from "@/utils/responsive";
import { useChatStyles } from "./chatheader.styles";
export default function index({
  chatData,
  userData,
  chatType,
  loadingData,
  id,
  isMenuVisible,
  setIsMenuVisible
}) {
  const styles = useChatStyles();
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          if (chatType === "group") {
            router.replace("/chat/screens/groups");
          } else {
            router.replace("/chat");
          }
        }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.textColor} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flexDirection: "row", width: "65%" }}
        disabled={loadingData}
        onPress={() => {
          router.push({
            pathname: `/chat/screens/UserDetails`,
            params: {
              id: id,
              name:
                chatType === "group"
                  ? chatData?.groupName || "Unknown Group"
                  : userData?.name || "Unknown User",
              profileImage:
                userData?.profileImage ||
                chatData?.groupImage ||
                "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
              chatType: chatType,
            },
          });
        }}
      >
        {loadingData ? (
          <SkeletonHeader />
        ) : chatData ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri:
                  chatType === "group"
                    ? chatData?.groupImage ||
                      "https://static.vecteezy.com/system/resources/previews/000/550/535/non_2x/user-icon-vector.jpg"
                    : userData?.profileImage ||
                      "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
              }}
              style={{
                width: responsive.width(40),
                height: responsive.height(40),
                borderRadius: 20,
                marginRight: responsive.width(10),
              }}
            />
            <Text style={styles.userName}>
              {chatType === "group" ? chatData?.groupName : userData?.name}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>

      <View style={{ flexDirection: "row", gap: 15 }}>
        <TouchableOpacity>
          <Ionicons name="videocam-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={22} color={theme.textColor} />
        </TouchableOpacity>
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
            <MaterialIcons name="more-vert" size={24} color={theme.textColor} />
          </TouchableOpacity>
          {isMenuVisible && (
            <View style={[styles.menu]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push({
                    pathname: `/chat/screens/UserDetails`,
                    params: {
                      id: id,
                      name:
                        chatType === "group"
                          ? chatData?.groupName || "Unknown Group"
                          : userData?.name || "Unknown User",
                      profileImage:
                        userData?.profileImage ||
                        "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                      chatType: chatType,
                    },
                  });
                }}
              >
                <Text style={styles.menuText}>View Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Media, Links & Docs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Clear Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
