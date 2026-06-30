import Constants from "expo-constants";

type AppEnv = "development" | "staging" | "production";

/**
 * API base URL is set in app.config.ts `extra.apiBaseUrl` so it matches APP_ENV even when
 * Metro loads a single `.env.development` (dynamic `process.env[name]` is not inlined for
 * EXPO_PUBLIC_* and is unreliable).
 */
function resolveApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as
    | { apiBaseUrl?: string; appEnv?: string }
    | undefined;
  const fromExtra = extra?.apiBaseUrl?.trim();
  if (fromExtra) return fromExtra;
  // Static access — Metro can inline for dev-only setups without embedded extra.
  const inlined = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (typeof inlined === "string" && inlined.length > 0) return inlined.trim();
  throw new Error(
    "Missing API base URL: rebuild the app so app.config.ts runs (extra.apiBaseUrl), or set EXPO_PUBLIC_API_BASE_URL.",
  );
}

/** Same flavor as app.config.ts / native ids — prefer app.json extra (set at build time). */
function resolveAppEnv(): AppEnv {
  const extra = Constants.expoConfig?.extra as { appEnv?: string } | undefined;
  const fromExtra = extra?.appEnv;
  if (
    fromExtra === "development" ||
    fromExtra === "staging" ||
    fromExtra === "production"
  ) {
    return fromExtra;
  }
  return (process.env.EXPO_PUBLIC_APP_ENV ?? "development") as AppEnv;
}

const env = {
  apiBaseUrl: resolveApiBaseUrl(),
  appEnv: resolveAppEnv(),
} as const;

export default env;
