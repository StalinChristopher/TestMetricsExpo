import type { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { DrawerParamList } from "../../navigation/types";
import { useThemedStyles } from "../../theme/useThemedStyles";

type Props = DrawerScreenProps<DrawerParamList, "About">;

export function AboutDrawerScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(
    colors => ({
      container: {
        flex: 1,
        padding: SpacingToken.spacing_value_4,
        gap: SpacingToken.spacing_value_2_5,
        backgroundColor: colors.background,
        paddingTop: SpacingToken.spacing_value_4 + insets.top,
      },
    }),
    [insets.top],
  );

  const goTabs = useCallback(
    () => navigation.navigate("TabRoot", { screen: "HomeTab", params: { screen: "HomeMain" } }),
    [navigation],
  );
  const closeDrawer = useCallback(() => navigation.closeDrawer(), [navigation]);

  return (
    <View style={styles.container}>
      <AppText variant="headingSm" color="text1">
        {t("aboutDrawer.title")}
      </AppText>
      <AppText variant="bodySm" color="text2" style={{ opacity: 0.7 }}>
        {t("aboutDrawer.caption")}
      </AppText>
      <AppButton
        label={t("aboutDrawer.goTabs")}
        onPress={goTabs}
      />
      <AppButton
        label={t("aboutDrawer.closeDrawer")}
        onPress={closeDrawer}
      />
    </View>
  );
}
