import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import SkeletonMessage from "@/components/loaders/SkeletonMessage";
import { formatTimestamp } from "@/utils/time";
import responsive from "@/utils/responsive";
import { auth } from "../../../app/config/firebaseConfig";
import { useChatStyles } from "./messagelist.styles";


export default function index({messages, loadingMessages, chatType, openImageModal}) {
    const styles = useChatStyles();
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={loadingMessages ? Array(5).fill({}) : messages}
        keyExtractor={(item, index) =>
          loadingMessages ? index.toString() : item.id
        }
        renderItem={({ item, index }) =>
          loadingMessages ? (
            <SkeletonMessage isSender={index % 2 === 0} />
          ) : (
            <View>
              <View
                style={
                  item.sender === auth.currentUser.uid
                    ? styles.sentMessage(item.isUrl)
                    : styles.receivedMessage(item.isUrl)
                }
              >
                {chatType === "group" &&
                  item.senderName &&
                  item.sender !== auth.currentUser.uid && (
                    <Text
                      style={{
                        color: theme.groupMessageSender,
                        fontSize: responsive.fontSize(14),
                        marginBottom: responsive.height(2),
                        fontWeight: 700,
                      }}
                    >
                      {item.senderName}
                    </Text>
                  )}
                {item.isUrl ? (
                  <TouchableOpacity
                    onPress={() => openImageModal(item.displayContent)}
                  >
                    <Image
                      source={{ uri: item.displayContent }}
                      style={{
                        width: responsive.width(200),
                        height: responsive.height(200),
                        borderRadius: 10,
                        borderTopRightRadius:
                          item.sender === auth.currentUser.uid ? 20 : 10,
                        borderTopLeftRadius:
                          item.sender === auth.currentUser.uid ? 10 : 20,
                        zIndex: 1,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.messageText}>{item.text}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.timestamp,
                  item.sender === auth.currentUser.uid
                    ? {
                        alignSelf: "flex-end",
                        marginRight: responsive.width(15),
                      }
                    : {
                        alignSelf: "flex-start",
                        marginLeft: responsive.width(15),
                      },
                ]}
              >
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: responsive.height(10) }}
        inverted
      />
    </View>
  );
}
