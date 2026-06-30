import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTranslation } from "react-i18next";

import { HomeDetailScreen } from "../../screens/home/HomeDetailScreen";
import { HomeScreen } from "../../screens/home/HomeScreen";
import type { HomeStackParamList } from "../types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="HomeDetail"
        component={HomeDetailScreen}
        options={{ headerShown: true, title: t("stacks.homeDetailTitle") }}
      />
    </Stack.Navigator>
  );
}
