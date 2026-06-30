import { getLocales } from "expo-localization";

export function getDeviceLanguageTag(): string {
  const list = getLocales();
  return list[0]?.languageTag ?? "en";
}
