import type { Theme } from "@react-navigation/native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { localStorageImpl } from "../third-party/localstorage/LocalStorageImpl";
import React, {
  createContext,
  FC,
  JSX,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import type { AppColors } from "./AppColors";
import { buildAppColors } from "./buildAppColors";
import {
  ThemeContextType,
  ThemePreference,
  ThemeType,
} from "./ThemeContextType";

function createAppNavigationTheme(
  appTheme: ThemeType,
  appColors: AppColors,
): Theme {
  const base = appTheme === "dark" ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: appTheme === "dark",
    colors: {
      ...base.colors,
      primary: appColors.primary,
      background: appColors.background,
      card: appTheme === "dark" ? appColors.background : appColors.white,
      text: appColors.text1,
      border: appColors.grayBackground,
      notification: appColors.error,
    },
  };
}

/** Maps React Native color scheme to resolved theme; null/unknown → light. */
function colorSchemeToResolved(scheme: string | null | undefined): ThemeType {
  return scheme === "dark" ? "dark" : "light";
}

function resolveTheme(
  preference: ThemePreference,
  colorScheme: string | null | undefined,
): ThemeType {
  if (preference === "system") {
    return colorSchemeToResolved(colorScheme);
  }
  return preference;
}

function readThemePreferenceFromStorage(): ThemePreference {
  const raw = localStorageImpl.getStringValue("app.theme");
  if (raw === "system" || raw === "light" || raw === "dark") {
    return raw;
  }
  return "system";
}

const defaultLightColors = buildAppColors("light");

const defaultThemeContextType: ThemeContextType = {
  theme: "light",
  themePreference: "light",
  colors: defaultLightColors,
  setTheme: () => {},
  navigationTheme: createAppNavigationTheme("light", defaultLightColors),
};

const AppThemeContext = createContext<ThemeContextType | null>(null);

export const AppThemeProvider: FC<PropsWithChildren> = ({
  children,
}): JSX.Element => {
  const colorScheme = useColorScheme();

  const [themePreference, setThemePreference] = useState<ThemePreference>(
    readThemePreferenceFromStorage,
  );

  const theme = useMemo(
    () => resolveTheme(themePreference, colorScheme),
    [themePreference, colorScheme],
  );

  const colors = useMemo(() => buildAppColors(theme), [theme]);

  const navigationTheme = useMemo(
    () => createAppNavigationTheme(theme, colors),
    [theme, colors],
  );

  useEffect(() => {
    localStorageImpl.setValue("app.theme", themePreference);
  }, [themePreference]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemePreference(next);
  }, []);

  return (
    <AppThemeContext.Provider
      value={{
        colors,
        theme,
        themePreference,
        setTheme,
        navigationTheme,
      }}
    >
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(AppThemeContext);
  if (context == null) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
};
