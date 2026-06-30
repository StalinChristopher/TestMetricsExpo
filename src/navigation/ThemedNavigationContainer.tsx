import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { useAppTheme } from "../theme/ThemeContext";
import { linking } from "./linking";
import { navigationRef } from "./navigationRef";
import { RootNavigator } from "./RootNavigator";

export function ThemedNavigationContainer() {
  const { theme, navigationTheme } = useAppTheme();

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      linking={linking}
    >
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}
