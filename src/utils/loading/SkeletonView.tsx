import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, type DimensionValue } from "react-native";
import type { SkeletonConfig } from "./types";

interface SkeletonViewProps extends SkeletonConfig {}

export function SkeletonView({
  lines = 1,
  width = "100%",
  height = 16,
  borderRadius = 4,
  animated = true,
}: SkeletonViewProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [animated, shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const lineElements = [];
  for (let i = 0; i < lines; i++) {
    const isLastLine = i === lines - 1;
    const lineWidth = isLastLine && lines > 1 ? "70%" : width;

    lineElements.push(
      <Animated.View
        key={i}
        style={[
          styles.skeleton,
          {
            width: lineWidth as DimensionValue,
            height: height as DimensionValue,
            borderRadius,
            opacity: animated ? opacity : 0.3,
            marginBottom: i < lines - 1 ? 12 : 0,
          },
        ]}
      />,
    );
  }

  return <View style={styles.container}>{lineElements}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  skeleton: {
    backgroundColor: "#E1E9EE",
  },
});
