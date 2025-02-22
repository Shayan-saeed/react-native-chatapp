import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useChatStyles } from "./attachmentmenu.styles";

export default function index({ pickImage }) {
    const styles = useChatStyles();
  return (
    <View style={styles.attachmentMenu}>
      <View style={styles.attachmentRow}>
        <TouchableOpacity
          style={styles.attachmentOption}
          onPress={() => console.log("Open Camera")}
        >
          <View style={styles.iconBox}>
            <Ionicons name="camera" size={30} color="white" />
          </View>
          <Text style={styles.attachmentText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
          <View style={styles.iconBox}>
            <Ionicons name="image" size={30} color="white" />
          </View>
          <Text style={styles.attachmentText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.attachmentOption}
          onPress={() => console.log("Share Location")}
        >
          <View style={styles.iconBox}>
            <Ionicons name="location" size={30} color="white" />
          </View>
          <Text style={styles.attachmentText}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.attachmentOption}
          onPress={() => console.log("Share Contact")}
        >
          <View style={styles.iconBox}>
            <Ionicons name="person" size={30} color="white" />
          </View>
          <Text style={styles.attachmentText}>Contact</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.attachmentRow}>
        <TouchableOpacity
          style={styles.attachmentOption}
          onPress={() => console.log("Select Document")}
        >
          <View style={styles.iconBox}>
            <Ionicons name="document" size={30} color="white" />
          </View>
          <Text style={styles.attachmentText}>Document</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.attachmentOption}
          onPress={() => console.log("Record Audio")}
        >
          <View style={styles.iconBox}>
            <Ionicons name="mic" size={30} color="white" />
          </View>
          <Text style={styles.attachmentText}>Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.attachmentOption}
          onPress={() => console.log("Create Poll")}
        >
          <View style={styles.iconBox}>
            <FontAwesome5 name="poll" size={30} color="white" />
          </View>
          <Text style={styles.attachmentText}>Poll</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}