import { View, Text } from "react-native";
import {useChatStyles} from "./calls.styles";

export default function CallsScreen() {
  const styles = useChatStyles();
  return (
    <View style={styles.center}>
      <Text style={styles.screenText}>Calls Screen (Coming Soon)</Text>
    </View>
  );
}

