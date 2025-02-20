import React from "react";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive"; 

export default function SkeletonHeader() {
  const theme = useTheme();

  return (
    <View style={{ marginVertical: responsive.height(8), alignSelf: "flex-start" }}>
      <Skeleton
        width={responsive.width(200)}  
        height={responsive.height(20)} 
        radius={responsive.width(5)} 
        colorMode={theme.colorMode}
      />
    </View>
  );
}
