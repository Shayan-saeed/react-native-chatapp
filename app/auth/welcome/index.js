import { Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./welcome.styles"

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0f0f0f", "#1e1e1e"]} style={styles.container}>
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
    </LinearGradient>
  );
}

