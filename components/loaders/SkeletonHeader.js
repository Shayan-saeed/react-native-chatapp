import React from "react";
import { Skeleton } from 'moti/skeleton';
import {View} from "react-native";
import {useTheme} from "@/components/theme/ThemeContext";
export default function SkeletonHeader() {
  const theme = useTheme();
  return (
    <View style={{ marginVertical: 8, alignSelf: "flex-start" }}>
      <Skeleton
        width={200}
        height={20}
        radius={5}
        colorMode={theme.colorMode} 
      />
    </View>
  );
}
