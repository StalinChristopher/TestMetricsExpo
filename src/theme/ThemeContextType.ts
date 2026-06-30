import type { Theme } from "@react-navigation/native";

import type { AppColors } from "./AppColors";

/** Resolved appearance used for colors and navigation (always light or dark). */
export type ThemeType = "dark" | "light";

/** User choice in Settings; may follow the OS when `system`. */
export type ThemePreference = "dark" | "light" | "system";

export interface ThemeContextType {
  /** Resolved light/dark; follows OS when preference is `system`. */
  theme: ThemeType;
  themePreference: ThemePreference;
  colors: AppColors;
  setTheme: (next: ThemePreference) => void;
  /** React Navigation theme; stays in sync with resolved `theme` / `colors`. */
  navigationTheme: Theme;
}
