import { useMemo, type DependencyList } from "react";
import { StyleSheet } from "react-native";

import type { AppColors } from "./AppColors";
import { useAppTheme } from "./ThemeContext";

/**
 * Builds a StyleSheet from the current theme colors. Recreates when `colors`
 * changes (e.g. after updating theme in Settings) or when `extraDeps` change.
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: AppColors) => T,
  extraDeps: DependencyList = [],
): T {
  const { colors } = useAppTheme();
  return useMemo(
    () => StyleSheet.create(factory(colors)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- factory is intentionally fresh; theme + caller deps drive updates
    [colors, ...extraDeps],
  );
}
