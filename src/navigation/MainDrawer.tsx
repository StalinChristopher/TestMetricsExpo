import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { useTranslation } from "react-i18next";

import { AboutDrawerScreen } from "../screens/drawer/AboutDrawerScreen";
import type { DrawerParamList } from "./types";
import { MainTabs } from "./MainTabs";
import { SettingsScreen } from "../screens/profile/SettingsScreen";
import { FeedbackCatalogScreen } from "../screens/FeedbackCatalogScreen";
import { CarouselCatalogScreen } from "../screens/CarouselCatalogScreen";

const Drawer = createDrawerNavigator<DrawerParamList>();

function MainDrawerContent(props: DrawerContentComponentProps) {
  const { state, descriptors } = props;

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const { drawerContentStyle, drawerContentContainerStyle } =
    focusedDescriptor.options;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={drawerContentContainerStyle}
      style={drawerContentStyle}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

/**
 * Drawer: opens from the left; contains primary tabs and a standalone drawer screen.
 */
export function MainDrawer() {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={p => <MainDrawerContent {...p} />}
      screenOptions={{
        drawerType: "front",
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="TabRoot"
        component={MainTabs}
        options={{
          title: t("drawer.tabRootTitle"),
          drawerLabel: t("drawer.tabRootLabel"),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t("drawer.settingsTitle") }}
      />
      <Drawer.Screen
        name="About"
        component={AboutDrawerScreen}
        options={{ title: t("drawer.aboutTitle") }}
      />
      <Drawer.Screen
        name="FeedbackCatalog"
        component={FeedbackCatalogScreen}
        options={{ title: "Feedback", drawerLabel: "Feedback Catalog" }}
      />
      <Drawer.Screen
        name="CarouselCatalog"
        component={CarouselCatalogScreen}
        options={{ title: "Carousel", drawerLabel: "Carousel Catalog" }}
      />
    </Drawer.Navigator>
  );
}
