import React from "react";
import { Text, type StyleProp, type TextStyle } from "react-native";

import { FontSizeToken } from "../designSystem/generated/fontSize";
import { LineHeightToken } from "../designSystem/generated/lineHeight";
import type { AppColors } from "../theme/AppColors";
import { useAppTheme } from "../theme/ThemeContext";

export type AppTextVariant =
  | "headingSm"
  | "bodyLg"
  | "bodyMd"
  | "bodySm"
  | "label";
export type AppTextColor = keyof AppColors;

const variantStyles: Record<AppTextVariant, TextStyle> = {
  headingSm: {
    fontSize: FontSizeToken.heading_sm,
    lineHeight: LineHeightToken.heading_sm,
    fontWeight: "700",
  },
  bodyLg: {
    fontSize: FontSizeToken.body_lg,
    lineHeight: LineHeightToken.body_lg,
  },
  bodyMd: {
    fontSize: FontSizeToken.body_md,
    lineHeight: LineHeightToken.body_md,
  },
  bodySm: {
    fontSize: FontSizeToken.body_sm,
    lineHeight: LineHeightToken.body_sm,
  },
  label: {
    fontSize: FontSizeToken.label_md,
    lineHeight: LineHeightToken.body_sm,
    fontWeight: "600",
  },
};

export type AppTextProps = {
  /** Typography variant — controls fontSize and lineHeight. */
  variant?: AppTextVariant;
  /** Semantic color key from AppColors. Defaults to 'text1'. */
  color?: AppTextColor;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  children: React.ReactNode;
};

/**
 * Themed typography primitive backed by design tokens.
 * Use instead of raw Text with hardcoded font sizes and colors.
 */
export const AppText = React.memo(function AppText({
  variant = "bodyMd",
  color = "text1",
  style,
  numberOfLines,
  children,
}: AppTextProps) {
  const { colors } = useAppTheme();

  return (
    <Text
      accessibilityRole="text"
      numberOfLines={numberOfLines}
      style={[variantStyles[variant], { color: colors[color] }, style]}
    >
      {children}
    </Text>
  );
});
