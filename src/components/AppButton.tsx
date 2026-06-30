import React from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";

import { BorderRadiusToken } from "../designSystem/generated/borderRadius";
import { ButtonHeightToken } from "../designSystem/generated/buttonHeight";
import { SpacingToken } from "../designSystem/generated/spacing";
import type { AppColors } from "../theme/AppColors";
import { useThemedStyles } from "../theme/useThemedStyles";
import { AppText, type AppTextColor } from "./AppText";

export type AppButtonVariant = "primary" | "secondary" | "ghost" | "error";

export type AppButtonProps = {
  /** Button label text. */
  label: string;
  /** Called when the button is pressed. */
  onPress: () => void;
  /** Visual style. Defaults to 'primary'. */
  variant?: AppButtonVariant;
  /** If true, button is non-interactive and styled as disabled. */
  disabled?: boolean;
  /** Passed to accessibilityLabel — defaults to label if omitted. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const variantBackgroundColor: Record<AppButtonVariant, keyof AppColors> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "transparent",
  error: "errorBackground",
};

const variantTextColor: Record<AppButtonVariant, AppTextColor> = {
  primary: "textOnPrimary",
  secondary: "textOnSecondary",
  ghost: "primary",
  error: "textOnError",
};

/**
 * Themed action button using design tokens and semantic colors.
 * Use instead of repeated Pressable + Text button patterns.
 */
export const AppButton = React.memo(function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  accessibilityLabel,
  style,
}: AppButtonProps) {
  const styles = useThemedStyles(
    c => ({
      btn: {
        paddingVertical: SpacingToken.spacing_value_3,
        paddingHorizontal: SpacingToken.spacing_value_3_5,
        borderRadius: BorderRadiusToken.lg,
        minHeight: ButtonHeightToken.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: c[variantBackgroundColor[variant]],
        opacity: disabled ? 0.5 : 1,
      },
    }),
    [variant, disabled],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.btn, style]}
    >
      <AppText variant="label" color={variantTextColor[variant]}>
        {label}
      </AppText>
    </Pressable>
  );
});
