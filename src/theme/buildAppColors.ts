import {
  ColorToken,
  type ColorTokenKey,
} from "../designSystem/generated/colors";
import semanticMap from "../../tokens/semantic-colors.json";
import type { AppColors } from "./AppColors";
import type { ThemeType } from "./ThemeContextType";

const TRANSPARENT_SENTINEL = "__transparent__";

const APP_COLOR_KEYS: (keyof AppColors)[] = [
  "black",
  "white",
  "background",
  "primary",
  "primaryLight",
  "secondary",
  "secondaryLight",
  "text1",
  "text2",
  "text3",
  "text4",
  "textOnPrimary",
  "textOnSecondary",
  "error",
  "errorBackground",
  "textOnError",
  "success",
  "transparent",
  "tabForegroundDefault",
  "tabForegroundActive",
  "inputBoxColor",
  "grayBackground",
];

type SemanticColorEntry = ColorTokenKey | typeof TRANSPARENT_SENTINEL;

function resolveSemanticColor(
  semanticKey: keyof AppColors,
  tokenKey: SemanticColorEntry,
  isDark: boolean,
): string {
  if (tokenKey === TRANSPARENT_SENTINEL) {
    return "transparent";
  }

  const resolver = ColorToken[tokenKey];
  if (resolver == null) {
    console.error(
      `[buildAppColors] ColorToken "${tokenKey}" for "${semanticKey}" not found. Using magenta fallback.`,
    );
    return "#FF00FF";
  }

  return resolver(isDark);
}

/** Resolves AppColors from generated design tokens and semantic-colors.json. */
export function buildAppColors(theme: ThemeType): AppColors {
  const isDark = theme === "dark";
  const colors = {} as AppColors;

  for (const key of APP_COLOR_KEYS) {
    const raw = (semanticMap as Record<string, SemanticColorEntry>)[key];
    if (raw == null) {
      console.error(
        `[buildAppColors] No mapping for "${key}" in semantic-colors.json. Using magenta fallback.`,
      );
      colors[key] = "#FF00FF";
      continue;
    }
    colors[key] = resolveSemanticColor(key, raw, isDark);
  }

  return colors;
}
