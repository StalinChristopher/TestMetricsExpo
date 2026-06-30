import { FlashList, type FlashListProps } from "@shopify/flash-list";
import React, { useMemo } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

export type AppListProps<T> = Omit<FlashListProps<T>, "keyExtractor" | "estimatedItemSize"> & {
  /** Stable unique key per row — never use array index alone. */
  keyExtractor: (item: T, index: number) => string;
  /** Approximate average item height in dp (width for horizontal lists). FlashList uses this to size its recycling pool — a rough estimate is fine. */
  estimatedItemSize: number;
  /** When true (default), the list expands to fill remaining flex space. */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * High-performance scrollable list backed by FlashList.
 * Use instead of FlatList for data-driven screens.
 */
export function AppList<T>({
  keyExtractor,
  fill = true,
  style,
  ...flashListProps
}: AppListProps<T>) {
  const flatStyle = useMemo(
    () => StyleSheet.flatten([fill ? { flex: 1 } : undefined, style]),
    [fill, style],
  );

  return (
    <FlashList
      keyExtractor={keyExtractor}
      style={flatStyle}
      {...flashListProps}
    />
  );
}
