import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { HomeStackParamList } from "../../navigation/types";
import { useThemedStyles } from "../../theme/useThemedStyles";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeDetail">;

export function HomeDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const styles = useThemedStyles(c => ({
    container: {
      flex: 1,
      padding: SpacingToken.spacing_value_4,
      gap: SpacingToken.spacing_value_2_5,
      backgroundColor: c.background,
    },
    successButton: {
      backgroundColor: c.success,
    },
  }));

  const { itemId, title } = route.params;

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const popToTop = useCallback(() => navigation.popToTop(), [navigation]);
  const replaceMain = useCallback(() => navigation.replace("HomeMain"), [navigation]);
  const setParamsTitle = useCallback(
    () => navigation.setParams({ title: t("homeDetail.updatedTitle") }),
    [navigation, t],
  );

  return (
    <View style={styles.container}>
      <AppText variant="headingSm" color="text1">
        {t("homeDetail.title")}
      </AppText>
      <AppText variant="bodyMd" color="text2">
        {t("homeDetail.itemId", { id: itemId })}
      </AppText>
      {title ? (
        <AppText variant="bodyMd" color="text2">
          {t("homeDetail.titleMeta", { title })}
        </AppText>
      ) : null}

      <AppButton
        label={t("homeDetail.goBack")}
        onPress={goBack}
        style={styles.successButton}
      />

      <AppButton
        label={t("homeDetail.popToTop")}
        onPress={popToTop}
        style={styles.successButton}
      />

      <AppButton
        label={t("homeDetail.replaceMain")}
        onPress={replaceMain}
        style={styles.successButton}
      />

      <AppButton
        label={t("homeDetail.setParams")}
        onPress={setParamsTitle}
        style={styles.successButton}
      />
    </View>
  );
}
