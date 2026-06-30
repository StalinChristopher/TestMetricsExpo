import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTranslation } from "react-i18next";

import { ExploreDetailScreen } from "../../screens/explore/ExploreDetailScreen";
import { ExploreScreen } from "../../screens/explore/ExploreScreen";
import type { ExploreStackParamList } from "../types";

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreMain" component={ExploreScreen} />
      <Stack.Screen
        name="ExploreDetail"
        component={ExploreDetailScreen}
        options={{ headerShown: true, title: t("stacks.exploreDetailTitle") }}
      />
    </Stack.Navigator>
  );
}
