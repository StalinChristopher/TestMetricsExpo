import React from "react";
import { Pressable, Text, View } from "react-native";

import { BorderRadiusToken } from "../../designSystem/generated/borderRadius";
import { FontSizeToken } from "../../designSystem/generated/fontSize";
import { LineHeightToken } from "../../designSystem/generated/lineHeight";
import { SpacingToken } from "../../designSystem/generated/spacing";
import { useThemedStyles } from "../../theme/useThemedStyles";

export type ErrorStateViewProps = {
  title: string;
  message?: string;
  details?: string;
  retryLabel?: string;
  onRetry?: () => void;
  layout?: "inline" | "fullscreen";
};

export function ErrorStateView({
  title,
  message,
  details,
  retryLabel,
  onRetry,
  layout = "inline",
}: ErrorStateViewProps) {
  const fullscreen = layout === "fullscreen";

  const styles = useThemedStyles(
    c => ({
      root: {
        ...(fullscreen
          ? { flex: 1 as const, justifyContent: "center" as const }
          : {}),
        alignItems: "center",
        paddingHorizontal: SpacingToken.spacing_value_6,
        paddingVertical: SpacingToken.spacing_value_8,
      },
      iconContainer: {
        width: SpacingToken.spacing_value_16,
        height: SpacingToken.spacing_value_16,
        borderRadius: BorderRadiusToken.full,
        backgroundColor: c.error + "15",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SpacingToken.spacing_value_5,
      },
      iconText: {
        fontSize: FontSizeToken.heading_lg,
      },
      title: {
        fontSize: FontSizeToken.heading_sm,
        fontWeight: "700",
        color: c.text1,
        textAlign: "center",
        marginBottom: SpacingToken.spacing_value_2,
      },
      message: {
        fontSize: FontSizeToken.body_md,
        lineHeight: LineHeightToken.body_md,
        color: c.text2,
        textAlign: "center",
        marginBottom: SpacingToken.spacing_value_2,
      },
      details: {
        fontSize: FontSizeToken.label_md,
        lineHeight: LineHeightToken.label_md,
        color: c.text3,
        textAlign: "center",
        marginBottom: SpacingToken.spacing_value_6,
      },
      retryButton: {
        paddingVertical: SpacingToken.spacing_value_3,
        paddingHorizontal: SpacingToken.spacing_value_8,
        borderRadius: BorderRadiusToken.xl_3,
        backgroundColor: c.primary,
        minWidth: SpacingToken.spacing_value_36,
      },
      retryLabel: {
        fontSize: FontSizeToken.body_md,
        fontWeight: "600",
        color: c.textOnPrimary,
        textAlign: "center",
      },
    }),
    [fullscreen],
  );

  return (
    <View style={styles.root}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>⚠️</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {details ? (
        <Text style={styles.details} selectable>
          {details}
        </Text>
      ) : null}
      {retryLabel && onRetry ? (
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && { opacity: 0.88 },
          ]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
        >
          <Text style={styles.retryLabel}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
