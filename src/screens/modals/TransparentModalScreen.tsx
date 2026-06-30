import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { BorderRadiusToken } from "../../designSystem/generated/borderRadius";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { RootStackParamList } from "../../navigation/types";
import { useThemedStyles } from "../../theme/useThemedStyles";

type Props = NativeStackScreenProps<RootStackParamList, "TransparentModal">;

export function TransparentModalScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const styles = useThemedStyles(colors => ({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "center",
      padding: SpacingToken.spacing_value_6,
    },
    dismissHitbox: {
      ...StyleSheet.absoluteFillObject,
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: BorderRadiusToken.xl,
      padding: SpacingToken.spacing_value_5,
      gap: SpacingToken.spacing_value_3,
    },
  }));

  const message = route.params?.message;
  const dismiss = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.backdrop}>
      <Pressable
        style={styles.dismissHitbox}
        onPress={dismiss}
      />
      <View style={styles.card}>
        <AppText variant="bodyLg" color="text1" style={{ fontWeight: "700" }}>
          {t("transparentModal.title")}
        </AppText>
        {message ? (
          <AppText variant="bodyMd" color="text2">
            {message}
          </AppText>
        ) : null}
        <AppButton
          label={t("transparentModal.close")}
          onPress={dismiss}
        />
      </View>
    </View>
  );
}
