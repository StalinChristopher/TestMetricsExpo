import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import type { MainTabParamList } from "./types";
import { ExploreStack } from "./stacks/ExploreStack";
import { HomeStack } from "./stacks/HomeStack";
import { ProfileStack } from "./stacks/ProfileStack";
import { PostStack } from "./stacks/PostStack";
import { useAppTheme } from "../theme/ThemeContext";

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Bottom tabs; each tab owns a nested native stack (push/pop/replace within tab).
 */
export function MainTabs() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "below-icon",
        tabBarInactiveTintColor: colors.text2,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: t("tabs.home"),
          tabBarIcon: () => (
            <Ionicons name="home" size={24} color={colors.text1} />
          ),
          tabBarLabel: t("tabs.home"),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreStack}
        options={{
          title: t("tabs.explore"),
          tabBarIcon: () => (
            <Ionicons name="search" size={24} color={colors.text1} />
          ),
          tabBarLabel: t("tabs.explore"),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: t("tabs.profile"),
          tabBarIcon: () => (
            <Ionicons name="person" size={24} color={colors.text1} />
          ),
          tabBarLabel: t("tabs.profile"),
        }}
      />
      <Tab.Screen
        name="PostsTab"
        component={PostStack}
        options={{
          title: t("tabs.posts"),
          tabBarIcon: () => (
            <Ionicons name="send" size={24} color={colors.text1} />
          ),
          tabBarLabel: t("tabs.posts"),
        }}
      />
    </Tab.Navigator>
  );
}
