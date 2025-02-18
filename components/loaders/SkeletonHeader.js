import React from "react";
import { Skeleton } from 'moti/skeleton';
import {View} from "react-native";

export default function SkeletonHeader() {
  return (
    <View style={{ marginVertical: 8, alignSelf: "flex-start" }}>
      <Skeleton
        width={200}
        height={20}
        radius={5}
        colorMode="dark" 
      />
    </View>
  );
}
