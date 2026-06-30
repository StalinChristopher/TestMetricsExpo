import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import type { InlineLoadingConfig } from "./types";

interface InlineLoadingProps extends InlineLoadingConfig {}

export function InlineLoading({
  size = "medium",
  variant = "spinner",
  color = "#007AFF",
}: InlineLoadingProps) {
  const size_value = size === "small" ? 24 : size === "large" ? 48 : 36;

  const renderLoadingIndicator = () => {
    switch (variant) {
      case "spinner":
      default:
        return (
          <ActivityIndicator
            size={size === "small" ? "small" : "large"}
            color={color}
          />
        );
      case "dots":
        return <DotsLoader size={size_value} color={color} />;
      case "pulse":
        return <PulseLoader size={size_value} color={color} />;
    }
  };

  return <View style={styles.container}>{renderLoadingIndicator()}</View>;
}

function DotsLoader({ size, color }: { size: number; color: string }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    Animated.parallel([
      createAnimation(dot1, 0),
      createAnimation(dot2, 150),
      createAnimation(dot3, 300),
    ]).start();
  }, [dot1, dot2, dot3]);

  const dotSize = size / 4;
  const scale1 = dot1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const scale2 = dot2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const scale3 = dot3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            transform: [{ scale: scale1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            transform: [{ scale: scale2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            transform: [{ scale: scale3 }],
          },
        ]}
      />
    </View>
  );
}

function PulseLoader({ size, color }: { size: number; color: string }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.pulseCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    borderRadius: 999,
  },
  pulseCircle: {},
});
