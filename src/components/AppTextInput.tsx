import React, { useState } from "react";
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { BorderRadiusToken } from "../designSystem/generated/borderRadius";
import { BorderWidthToken } from "../designSystem/generated/borderWidth";
import { ButtonHeightToken } from "../designSystem/generated/buttonHeight";
import { FontSizeToken } from "../designSystem/generated/fontSize";
import { LineHeightToken } from "../designSystem/generated/lineHeight";
import { SpacingToken } from "../designSystem/generated/spacing";
import type { AppColors } from "../theme/AppColors";
import { useAppTheme } from "../theme/ThemeContext";
import { useThemedStyles } from "../theme/useThemedStyles";
import { AppText } from "./AppText";

export type AppTextInputSize = "sm" | "md";

export type AppTextInputProps = {
  /** Current field value. */
  value: string;
  /** Called when the user edits the text. */
  onChangeText: (text: string) => void;
  /** Placeholder shown when the value is empty. */
  placeholder?: string;
  /** If true, masks input (e.g. passwords). */
  secureTextEntry?: boolean;
  /** If true, the field is non-editable. */
  disabled?: boolean;
  /** When true, applies error border styling. */
  hasError?: boolean;
  /** Optional label rendered above the field. */
  label?: string;
  /** Controls min height and typography scale. Defaults to 'md'. */
  size?: AppTextInputSize;
  /** Accessibility label — defaults to label or placeholder when omitted. */
  accessibilityLabel?: string;
  /** Keyboard type forwarded to the native TextInput. */
  keyboardType?: TextInputProps["keyboardType"];
  /** When true, allows multiple lines of text. */
  multiline?: boolean;
  /** Auto-capitalization behavior forwarded to TextInput. */
  autoCapitalize?: TextInputProps["autoCapitalize"];
  /** Auto-correct behavior forwarded to TextInput. */
  autoCorrect?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const sizeMinHeight: Record<AppTextInputSize, number> = {
  sm: ButtonHeightToken.sm,
  md: ButtonHeightToken.md,
};

const sizeTypography: Record<
  AppTextInputSize,
  { fontSize: number; lineHeight: number }
> = {
  sm: {
    fontSize: FontSizeToken.body_sm,
    lineHeight: LineHeightToken.body_sm,
  },
  md: {
    fontSize: FontSizeToken.body_md,
    lineHeight: LineHeightToken.body_md,
  },
};

function borderColorKey(
  focused: boolean,
  hasError: boolean,
  disabled: boolean,
): keyof AppColors {
  if (hasError) {
    return "error";
  }
  if (disabled) {
    return "grayBackground";
  }
  if (focused) {
    return "primary";
  }
  return "grayBackground";
}

/**
 * Themed text field using design tokens and semantic colors.
 * Use instead of raw TextInput with hardcoded styles (Android EditText equivalent).
 */
export function AppTextInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  disabled = false,
  hasError = false,
  label,
  size = "md",
  accessibilityLabel,
  keyboardType,
  multiline = false,
  autoCapitalize = "sentences",
  autoCorrect = true,
  style,
  inputStyle,
}: AppTextInputProps) {
  const [focused, setFocused] = useState(false);
  const { colors } = useAppTheme();

  const styles = useThemedStyles(
    c => ({
      field: {
        minHeight: multiline ? undefined : sizeMinHeight[size],
        paddingVertical: SpacingToken.spacing_value_2_5,
        paddingHorizontal: SpacingToken.spacing_value_3,
        borderRadius: BorderRadiusToken.lg,
        borderWidth: BorderWidthToken.thin,
        borderColor: c[borderColorKey(focused, hasError, disabled)],
        backgroundColor: c.inputBoxColor,
        opacity: disabled ? 0.6 : 1,
      },
      input: {
        ...sizeTypography[size],
        color: c.text1,
        padding: 0,
        margin: 0,
      },
      label: {
        marginBottom: SpacingToken.spacing_value_1_5,
      },
    }),
    [focused, hasError, disabled, size, multiline],
  );

  const a11yLabel = accessibilityLabel ?? label ?? placeholder;

  return (
    <View style={style}>
      {label ? (
        <AppText variant="label" color="text1" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={styles.field}>
        <TextInput
          accessibilityLabel={a11yLabel}
          accessibilityState={{ disabled }}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={!disabled}
          keyboardType={keyboardType}
          multiline={multiline}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={colors.text3}
          secureTextEntry={secureTextEntry}
          style={[styles.input, inputStyle]}
          value={value}
        />
      </View>
    </View>
  );
}
