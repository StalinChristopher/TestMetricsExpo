import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { RootStackParamList } from "../../navigation/types";
import { useThemedStyles } from "../../theme/useThemedStyles";

type Props = NativeStackScreenProps<RootStackParamList, "ExampleModal">;

export function ExampleModalScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dismiss = useCallback(() => navigation.goBack(), [navigation]);
  const styles = useThemedStyles(colors => ({
    container: {
      flex: 1,
      padding: SpacingToken.spacing_value_6,
      justifyContent: "center",
      gap: SpacingToken.spacing_value_3,
      backgroundColor: colors.background,
    },
  }));

  return (
    <View style={styles.container}>
      <AppText
        variant="bodyLg"
        color="text1"
        style={{ fontWeight: "700", textAlign: "center" }}
      >
        {t("exampleModal.title")}
      </AppText>
      <AppText
        variant="bodySm"
        color="text2"
        style={{ opacity: 0.7, textAlign: "center" }}
      >
        {t("exampleModal.caption")}
      </AppText>
      <AppButton
        label={t("exampleModal.dismiss")}
        onPress={dismiss}
      />
    </View>
  );
}
