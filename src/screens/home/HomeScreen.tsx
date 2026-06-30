import { DrawerActions } from "@react-navigation/native";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { TopBar } from "../../components/TopBar";
import { APP_DISPLAY_NAME } from "../../config/appDisplayName";
import { SpacingToken } from "../../designSystem/generated/spacing";
import { navigationRef } from "../../navigation/navigationRef";
import type { HomeMainCompositeProps } from "../../navigation/screenTypes";
import { useThemedStyles } from "../../theme/useThemedStyles";

type Props = HomeMainCompositeProps;

export function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();

  const openDrawer = useCallback(
    () => navigation.dispatch(DrawerActions.openDrawer()),
    [navigation],
  );
  const navigateDetail = useCallback(
    () => navigation.navigate("HomeDetail", { itemId: "42", title: t("home.demoItemTitle") }),
    [navigation, t],
  );
  const pushDuplicate = useCallback(() => navigation.push("HomeMain"), [navigation]);
  const jumpExplore = useCallback(
    () => navigation.navigate("ExploreTab", { screen: "ExploreMain" }),
    [navigation],
  );
  const openSettings = useCallback(
    () => navigation.navigate("ProfileTab", { screen: "Settings", params: { from: "Home" } }),
    [navigation],
  );
  const openRootModal = useCallback(() => navigationRef.navigate("ExampleModal"), []);
  const openTransparentModal = useCallback(
    () => navigationRef.navigate("TransparentModal", { message: t("home.fromHomeMessage") }),
    [t],
  );
  const openFullScreenModal = useCallback(() => navigationRef.navigate("FullScreenModal"), []);

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

  return (
    <View style={styles.root}>
      <TopBar
        topBarTitle={APP_DISPLAY_NAME}
        onMenuPress={openDrawer}
      />
      <View style={styles.container}>
        <AppText variant="headingSm" color="text1">
          {t("home.title")}
        </AppText>
        <AppText variant="bodySm" color="text2" style={{ opacity: 0.7 }}>
          {t("home.caption")}
        </AppText>

        <AppButton
          label={t("home.navigateDetail")}
          onPress={navigateDetail}
        />

        <AppButton
          label={t("home.pushDuplicate")}
          onPress={pushDuplicate}
        />

        <AppButton
          label={t("home.jumpExplore")}
          onPress={jumpExplore}
        />

        <AppButton
          label={t("home.openSettings")}
          onPress={openSettings}
        />

        <AppButton
          label={t("home.rootModal")}
          onPress={openRootModal}
        />

        <AppButton
          label={t("home.transparentModal")}
          onPress={openTransparentModal}
        />

        <AppButton
          label={t("home.fullScreenModal")}
          onPress={openFullScreenModal}
        />
      </View>
    </View>
  );
}
