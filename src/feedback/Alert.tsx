import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";

import { AppText } from "../components/AppText";
import { BorderRadiusToken } from "../designSystem/generated/borderRadius";
import { SpacingToken } from "../designSystem/generated/spacing";
import { useAppTheme } from "../theme/ThemeContext";
import { useThemedStyles } from "../theme/useThemedStyles";
import { getFeedbackTypeBackground } from "./feedbackTypeColors";
import type { AlertConfig } from "./types";

interface AlertProps {
  config: AlertConfig | null;
  onDismiss: () => void;
}

const { width } = Dimensions.get("window");

export function Alert({ config, onDismiss }: AlertProps) {
  const { colors } = useAppTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  const styles = useThemedStyles(c => ({
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: SpacingToken.spacing_value_5,
    },
    alertBox: {
      width: Math.min(width - SpacingToken.spacing_value_16, 340),
      backgroundColor: c.background,
      borderRadius: BorderRadiusToken.xl_2,
      padding: SpacingToken.spacing_value_6,
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: c.black,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        },
        android: {
          elevation: 12,
        },
      }),
    },
    iconContainer: {
      width: SpacingToken.spacing_value_14,
      height: SpacingToken.spacing_value_14,
      borderRadius: BorderRadiusToken.full,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SpacingToken.spacing_value_4,
    },
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
    },
    button: {
      flex: 1,
      paddingVertical: SpacingToken.spacing_value_3,
      paddingHorizontal: SpacingToken.spacing_value_4,
      borderRadius: BorderRadiusToken.lg,
      backgroundColor: c.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonCancel: {
      backgroundColor: c.grayBackground,
    },
    buttonDestructive: {
      backgroundColor: c.error,
    },
    buttonPressed: {
      opacity: 0.7,
    },
    buttonMargin: {
      marginLeft: SpacingToken.spacing_value_3,
    },
  }));

  useEffect(() => {
    if (config) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [config, fadeAnim, scaleAnim]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!config) return null;

  const buttons = config.buttons || [{ text: "OK", onPress: handleDismiss }];
  const iconColor = getFeedbackTypeBackground(config.type, colors);

  return (
    <Modal transparent visible animationType="none">
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </Pressable>
      <View style={styles.centeredView}>
        <Animated.View
          style={[
            styles.alertBox,
            { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
            <AppText
              variant="headingSm"
              color="textOnPrimary"
              style={{ fontWeight: "700" }}
            >
              {getIcon(config.type || "info")}
            </AppText>
          </View>
          <AppText
            variant="bodyLg"
            color="text1"
            style={{
              fontWeight: "700",
              marginBottom: SpacingToken.spacing_value_2,
              textAlign: "center",
            }}
          >
            {config.title}
          </AppText>
          <AppText
            variant="bodySm"
            color="text2"
            style={{
              textAlign: "center",
              marginBottom: SpacingToken.spacing_value_6,
            }}
          >
            {config.message}
          </AppText>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.button,
                  button.style === "cancel" && styles.buttonCancel,
                  button.style === "destructive" && styles.buttonDestructive,
                  pressed && styles.buttonPressed,
                  buttons.length > 1 && index > 0 && styles.buttonMargin,
                ]}
                onPress={() => {
                  button.onPress?.();
                  handleDismiss();
                }}
                accessibilityRole="button"
                accessibilityLabel={button.text}
              >
                <AppText
                  variant="bodyMd"
                  color={button.style === "cancel" ? "text1" : "textOnPrimary"}
                  style={{ fontWeight: "600" }}
                >
                  {button.text}
                </AppText>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function getIcon(type: string): string {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✕";
    case "warning":
      return "⚠";
    case "info":
    default:
      return "i";
  }
}
