export const SUPPORTED_LANGUAGES = ["en", "es"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function matchSupportedLanguage(deviceTag: string): SupportedLanguage {
  const primary = deviceTag.split("-")[0]?.toLowerCase() ?? "en";
  if (primary === "es") {
    return "es";
  }
  return "en";
}

export function resolveInitialLanguage(
  stored: string | undefined,
  deviceTag: string,
): SupportedLanguage {
  if (stored && isSupportedLanguage(stored)) {
    return stored;
  }
  return matchSupportedLanguage(deviceTag);
}
