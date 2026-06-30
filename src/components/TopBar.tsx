import React from "react";
import {
  Pressable,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ButtonHeightToken } from "../designSystem/generated/buttonHeight";
import { SpacingToken } from "../designSystem/generated/spacing";
import { useAppTheme } from "../theme/ThemeContext";
import { useThemedStyles } from "../theme/useThemedStyles";
import { AppText } from "./AppText";

export type TopBarProps = {
  /** Shown next to the menu or back control (e.g. product name). */
  topBarTitle: string;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
} & (
  | { onMenuPress: () => void; onBackPress?: undefined }
  | { onBackPress: () => void; onMenuPress?: undefined }
);

export const TopBar = React.memo(function TopBar({
  topBarTitle,
  onBackPress,
  onMenuPress,
  rightAction,
  style,
  titleStyle,
}: TopBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = useThemedStyles(c => ({
    outer: {
      backgroundColor: c.background,
    },
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: SpacingToken.spacing_value_3,
      paddingBottom: SpacingToken.spacing_value_2,
      minHeight: ButtonHeightToken.md,
    },
    leadingButton: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: SpacingToken.spacing_value_1,
      paddingVertical: SpacingToken.spacing_value_2,
    },
    appName: {
      flex: 1,
    },
    rightSlot: {
      minWidth: ButtonHeightToken.md,
      minHeight: ButtonHeightToken.md,
      justifyContent: "center",
      alignItems: "center",
    },
  }));

  const leadingIsMenu = onMenuPress != null;
  const handleLeadingPress = leadingIsMenu ? onMenuPress : onBackPress!;

  return (
    <View style={[styles.outer, { paddingTop: insets.top }, style]}>
      <View style={styles.contentRow}>
        <Pressable
          style={styles.leadingButton}
          onPress={handleLeadingPress}
          accessibilityRole="button"
          accessibilityLabel={leadingIsMenu ? "Open menu" : "Go back"}
        >
          <Ionicons
            name={leadingIsMenu ? "menu" : "chevron-back"}
            size={26}
            color={colors.text1}
          />
        </Pressable>
        <AppText
          variant="bodyLg"
          color="text1"
          numberOfLines={1}
          style={[styles.appName, { fontWeight: "600" }, titleStyle]}
        >
          {topBarTitle}
        </AppText>
        <View style={styles.rightSlot}>{rightAction ?? null}</View>
      </View>
    </View>
  );
});
