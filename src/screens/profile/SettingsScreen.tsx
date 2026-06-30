import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import i18n from "i18next";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "../../components/AppText";
import { TopBar } from "../../components/TopBar";
import { APP_DISPLAY_NAME } from "../../config/appDisplayName";
import { BorderRadiusToken } from "../../designSystem/generated/borderRadius";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { ProfileStackParamList } from "../../navigation/types";
import { useSettingsRemoteFlags } from "../../settings/useSettingsRemoteFlags";
import { changeAppLanguage } from "../../third-party/i18n/changeAppLanguage";
import { getDeviceLanguageTag } from "../../third-party/i18n/getDeviceLanguageTag";
import { matchSupportedLanguage } from "../../third-party/i18n/supportedLanguages";
import { localStorageImpl } from "../../third-party/localstorage/LocalStorageImpl";
import { useAppTheme } from "../../theme/ThemeContext";
import { useThemedStyles } from "../../theme/useThemedStyles";

import {
  LanguagePickerBottomSheet,
  type LanguagePickerOption,
} from "./LanguagePickerBottomSheet";
import {
  ThemePickerBottomSheet,
  type ThemePickerOption,
} from "./ThemePickerBottomSheet";

type Props = NativeStackScreenProps<ProfileStackParamList, "Settings">;

function resolveLanguageSelectionKey(): LanguagePickerOption {
  const stored = localStorageImpl.getStringValue("app.locale");
  if (!stored) {
    return "device";
  }
  if (stored === "es") {
    return "es";
  }
  return "en";
}

export function SettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { showLanguagePicker, showThemeToggle } = useSettingsRemoteFlags();
  const { colors, themePreference, setTheme } = useAppTheme();
  const languageSheetRef = useRef<BottomSheetModalMethods>(null);
  const themeSheetRef = useRef<BottomSheetModalMethods>(null);

  const styles = useThemedStyles(c => ({
    container: {
      flex: 1,
      padding: SpacingToken.spacing_value_4,
      gap: SpacingToken.spacing_value_2_5,
      backgroundColor: c.background,
    },
    languageTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: c.primaryLight,
      paddingVertical: SpacingToken.spacing_value_3,
      paddingHorizontal: SpacingToken.spacing_value_3_5,
      borderRadius: BorderRadiusToken.lg,
    },
    languageTriggerText: {
      flex: 1,
    },
    settingsTriggers: {
      gap: SpacingToken.spacing_value_2_5,
    },
  }));

  const selectedKey = resolveLanguageSelectionKey();

  const openLanguageSheet = useCallback(() => {
    languageSheetRef.current?.present();
  }, []);

  const openThemeSheet = useCallback(() => {
    themeSheetRef.current?.present();
  }, []);

  const handleLanguageSelect = useCallback((option: LanguagePickerOption) => {
    if (option === "en") {
      changeAppLanguage("en");
    } else if (option === "es") {
      changeAppLanguage("es");
    } else {
      localStorageImpl.removeValue("app.locale");
      i18n
        .changeLanguage(matchSupportedLanguage(getDeviceLanguageTag()))
        .catch(() => {});
    }
    languageSheetRef.current?.dismiss();
  }, []);

  const handleThemeSelect = useCallback(
    (option: ThemePickerOption) => {
      setTheme(option);
      themeSheetRef.current?.dismiss();
    },
    [setTheme],
  );

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <TopBar
        topBarTitle={APP_DISPLAY_NAME}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.settingsTriggers}>
        {showLanguagePicker ? (
          <Pressable
            accessibilityRole="button"
            style={styles.languageTrigger}
            onPress={openLanguageSheet}
          >
            <AppText
              variant="label"
              color="textOnSecondary"
              style={styles.languageTriggerText}
            >
              {t("settings.language")}
            </AppText>
            <Ionicons name="chevron-forward" size={20} color={colors.text1} />
          </Pressable>
        ) : null}
        {showThemeToggle ? (
          <Pressable
            accessibilityRole="button"
            style={styles.languageTrigger}
            onPress={openThemeSheet}
          >
            <AppText
              variant="label"
              color="textOnSecondary"
              style={styles.languageTriggerText}
            >
              {t("settings.theme")}
            </AppText>
            <Ionicons name="chevron-forward" size={20} color={colors.text1} />
          </Pressable>
        ) : null}
      </View>
      {showLanguagePicker ? (
        <LanguagePickerBottomSheet
          ref={languageSheetRef}
          selectedKey={selectedKey}
          onSelect={handleLanguageSelect}
        />
      ) : null}
      {showThemeToggle ? (
        <ThemePickerBottomSheet
          ref={themeSheetRef}
          selectedKey={themePreference}
          onSelect={handleThemeSelect}
        />
      ) : null}
    </SafeAreaView>
  );
}
