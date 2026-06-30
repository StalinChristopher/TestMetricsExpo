import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { forwardRef, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "../../components/AppText";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { ThemePreference } from "../../theme/ThemeContextType";
import { useThemedStyles } from "../../theme/useThemedStyles";

export type ThemePickerOption = ThemePreference;

type Props = {
  selectedKey: ThemePickerOption;
  onSelect: (option: ThemePickerOption) => void;
};

const OPTIONS: readonly {
  key: ThemePickerOption;
  labelKey:
    | "settings.themeSystem"
    | "settings.themeLight"
    | "settings.themeDark";
}[] = [
  { key: "system", labelKey: "settings.themeSystem" },
  { key: "light", labelKey: "settings.themeLight" },
  { key: "dark", labelKey: "settings.themeDark" },
];

type OptionRowProps = {
  optionKey: ThemePickerOption;
  label: string;
  isSelected: boolean;
  isLast: boolean;
  rowStyle: object;
  rowLastStyle: object;
  onSelect: (key: ThemePickerOption) => void;
};

const OptionRow = memo(function OptionRow({
  optionKey,
  label,
  isSelected,
  isLast,
  rowStyle,
  rowLastStyle,
  onSelect,
}: OptionRowProps) {
  const handlePress = useCallback(() => onSelect(optionKey), [onSelect, optionKey]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={handlePress}
      style={[rowStyle, isLast && rowLastStyle]}
    >
      <AppText
        variant="bodyMd"
        color="text1"
        style={isSelected ? { fontWeight: "700" } : undefined}
      >
        {label}
      </AppText>
      {isSelected ? (
        <AppText variant="bodyMd" color="primary" style={{ fontWeight: "700" }}>
          ✓
        </AppText>
      ) : (
        <View />
      )}
    </Pressable>
  );
});

export const ThemePickerBottomSheet = forwardRef<
  BottomSheetModalMethods,
  Props
>(function ThemePickerBottomSheet({ selectedKey, onSelect }, ref) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const styles = useThemedStyles(
    colors => ({
      sheetBackground: {
        backgroundColor: colors.background,
      },
      handleIndicator: {
        backgroundColor: colors.text3,
      },
      content: {
        paddingHorizontal: SpacingToken.spacing_value_5,
        paddingBottom: Math.max(insets.bottom, SpacingToken.spacing_value_4),
        paddingTop: SpacingToken.spacing_value_2,
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: SpacingToken.spacing_value_3_5,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayBackground,
      },
      rowLast: {
        borderBottomWidth: 0,
      },
    }),
    [insets.bottom],
  );

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      enablePanDownToClose
      enableDynamicSizing
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.content}>
        <AppText
          variant="bodyLg"
          color="text1"
          style={{
            fontWeight: "700",
            marginBottom: SpacingToken.spacing_value_4,
          }}
        >
          {t("settings.themeSheetTitle")}
        </AppText>
        {OPTIONS.map((option, index) => (
          <OptionRow
            key={option.key}
            optionKey={option.key}
            label={t(option.labelKey)}
            isSelected={selectedKey === option.key}
            isLast={index === OPTIONS.length - 1}
            rowStyle={styles.row}
            rowLastStyle={styles.rowLast}
            onSelect={onSelect}
          />
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
