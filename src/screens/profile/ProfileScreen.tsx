import { CommonActions, DrawerActions } from "@react-navigation/native";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { TopBar } from "../../components/TopBar";
import { APP_DISPLAY_NAME } from "../../config/appDisplayName";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { ProfileMainCompositeProps } from "../../navigation/screenTypes";
import { useThemedStyles } from "../../theme/useThemedStyles";

type Props = ProfileMainCompositeProps;

export function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const styles = useThemedStyles(
    colors => ({
      root: { flex: 1, backgroundColor: colors.background },
      container: {
        flex: 1,
        padding: SpacingToken.spacing_value_4,
        gap: SpacingToken.spacing_value_2_5,
        backgroundColor: colors.background,
      },
    }),
    [],
  );

  const openDrawer = useCallback(
    () => navigation.dispatch(DrawerActions.openDrawer()),
    [navigation],
  );
  const navigateSettings = useCallback(() => navigation.navigate("Settings"), [navigation]);
  const resetStack = useCallback(
    () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "ProfileMain" }] })),
    [navigation],
  );

  return (
    <View style={styles.root}>
      <TopBar
        topBarTitle={APP_DISPLAY_NAME}
        onMenuPress={openDrawer}
      />
      <View style={styles.container}>
        <AppText variant="headingSm" color="text1">
          {t("profile.title")}
        </AppText>

        <AppButton
          label={t("profile.navigateSettings")}
          variant="secondary"
          onPress={navigateSettings}
        />

        <AppButton
          label={t("profile.reset")}
          variant="secondary"
          onPress={resetStack}
        />
      </View>
    </View>
  );
}
