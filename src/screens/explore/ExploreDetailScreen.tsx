import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { ExploreStackParamList } from "../../navigation/types";
import { useThemedStyles } from "../../theme/useThemedStyles";

type Props = NativeStackScreenProps<ExploreStackParamList, "ExploreDetail">;

export function ExploreDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const styles = useThemedStyles(colors => ({
    container: {
      flex: 1,
      padding: SpacingToken.spacing_value_4,
      gap: SpacingToken.spacing_value_2_5,
      backgroundColor: colors.background,
    },
  }));

  const pop = useCallback(() => navigation.pop(), [navigation]);

  return (
    <View style={styles.container}>
      <AppText variant="headingSm" color="text1">
        {t("exploreDetail.title", { section: route.params.section })}
      </AppText>
      <AppButton
        label={t("exploreDetail.pop")}
        variant="secondary"
        onPress={pop}
      />
    </View>
  );
}
