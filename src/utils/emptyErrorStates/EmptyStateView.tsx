import React from "react";
import { Pressable, Text, View } from "react-native";

import { BorderRadiusToken } from "../../designSystem/generated/borderRadius";
import { FontSizeToken } from "../../designSystem/generated/fontSize";
import { LineHeightToken } from "../../designSystem/generated/lineHeight";
import { SpacingToken } from "../../designSystem/generated/spacing";
import { useThemedStyles } from "../../theme/useThemedStyles";

export type EmptyStateViewProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  icon?: string;
  layout?: "inline" | "fullscreen";
};

export function EmptyStateView({
  title,
  description,
  actionLabel,
  onActionPress,
  icon = "📭",
  layout = "inline",
}: EmptyStateViewProps) {
  const fullscreen = layout === "fullscreen";

  const styles = useThemedStyles(
    c => ({
      root: {
        ...(fullscreen
          ? { flex: 1 as const, justifyContent: "center" as const }
          : {}),
        alignItems: "center",
        paddingHorizontal: SpacingToken.spacing_value_6,
        paddingVertical: SpacingToken.spacing_value_12,
      },
      iconContainer: {
        width: SpacingToken.spacing_value_20,
        height: SpacingToken.spacing_value_20,
        borderRadius: BorderRadiusToken.full,
        backgroundColor: c.grayBackground,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SpacingToken.spacing_value_5,
      },
      iconText: {
        fontSize: FontSizeToken.heading_xl,
      },
      title: {
        fontSize: FontSizeToken.heading_sm,
        fontWeight: "700",
        color: c.text1,
        textAlign: "center",
        marginBottom: SpacingToken.spacing_value_2,
      },
      description: {
        fontSize: FontSizeToken.body_md,
        lineHeight: LineHeightToken.body_md,
        color: c.text2,
        textAlign: "center",
        marginBottom: SpacingToken.spacing_value_6,
      },
      actionButton: {
        paddingVertical: SpacingToken.spacing_value_3,
        paddingHorizontal: SpacingToken.spacing_value_8,
        borderRadius: BorderRadiusToken.xl_3,
        backgroundColor: c.primary,
        minWidth: SpacingToken.spacing_value_36,
      },
      actionLabel: {
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
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {actionLabel && onActionPress ? (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.88 },
          ]}
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
