import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useChatStyles } from "./welcome.styles"

export default function WelcomeScreen() {
  const styles = useChatStyles();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://www.clipartmax.com/png/middle/454-4548222_social-intercom-chat-icon-svg.png" }}
        style={styles.image}
      />

      <Text style={styles.heading}>Welcome to Chat App</Text>
      <Text style={styles.subHeading}>Connect seamlessly with anyone, anytime.</Text>

      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/auth/signup")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/auth/login")}>
        <Text style={styles.signInText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

