import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTranslation } from "react-i18next";

import { ExampleModalScreen } from "../screens/modals/ExampleModalScreen";
import { FullScreenModalScreen } from "../screens/modals/FullScreenModalScreen";
import { TransparentModalScreen } from "../screens/modals/TransparentModalScreen";
import type { RootStackParamList } from "./types";
import { MainDrawer } from "./MainDrawer";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root native stack: main app (drawer + tabs + nested stacks) and presentation modals.
 */
export function RootNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: "default",
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExampleModal"
        component={ExampleModalScreen}
        options={{
          title: t("rootModals.exampleTitle"),
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="TransparentModal"
        component={TransparentModalScreen}
        options={{
          title: t("rootModals.transparentTitle"),
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FullScreenModal"
        component={FullScreenModalScreen}
        options={{
          title: t("rootModals.fullScreenTitle"),
          presentation: "fullScreenModal",
        }}
      />
    </Stack.Navigator>
  );
}
