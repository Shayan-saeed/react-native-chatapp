import React from "react";
import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { useTheme } from "@/components/theme/ThemeContext";
import responsive from "@/utils/responsive";

export default function StatusListLoader() {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignSelf: "flex-start",
        alignItems: "center",
        marginHorizontal: 5,
        marginVertical: 10,
      }}
    >
      <Skeleton
        width={responsive.width(50)}
        height={responsive.height(50)}
        radius="round"
        colorMode={theme.colorMode}
      />
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Skeleton
          width={responsive.width(150)}
          height={responsive.height(20)}
          radius={responsive.width(5)}
          colorMode={theme.colorMode}
        />
        <Skeleton
          width={responsive.width(60)}
          height={responsive.height(12)}
          radius={responsive.width(5)}
          colorMode={theme.colorMode}
        />
      </View>
    </View>
  );
}
