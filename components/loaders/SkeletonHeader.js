import React from "react";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive"; 

export default function SkeletonHeader() {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row", gap:4, alignSelf: "flex-start", alignItems: "center" }}>
      <Skeleton width={40} height={responsive.height(40)} radius="round" colorMode={theme.colorMode} />
      <Skeleton
        width={responsive.width(150)}  
        height={responsive.height(20)} 
        radius={responsive.width(5)} 
        colorMode={theme.colorMode}
      />
    </View>
  );
}
