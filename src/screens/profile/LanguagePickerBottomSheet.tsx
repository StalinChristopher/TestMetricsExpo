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
import { useThemedStyles } from "../../theme/useThemedStyles";

export type LanguagePickerOption = "en" | "es" | "device";

type Props = {
  selectedKey: LanguagePickerOption;
  onSelect: (option: LanguagePickerOption) => void;
};

const OPTIONS: readonly {
  key: LanguagePickerOption;
  labelKey:
    | "settings.languageEnglish"
    | "settings.languageSpanish"
    | "settings.useDeviceLanguage";
}[] = [
  { key: "en", labelKey: "settings.languageEnglish" },
  { key: "es", labelKey: "settings.languageSpanish" },
  { key: "device", labelKey: "settings.useDeviceLanguage" },
];

type OptionRowProps = {
  optionKey: LanguagePickerOption;
  label: string;
  isSelected: boolean;
  isLast: boolean;
  rowStyle: object;
  rowLastStyle: object;
  onSelect: (key: LanguagePickerOption) => void;
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

export const LanguagePickerBottomSheet = forwardRef<
  BottomSheetModalMethods,
  Props
>(function LanguagePickerBottomSheet({ selectedKey, onSelect }, ref) {
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
          {t("settings.languageSheetTitle")}
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
