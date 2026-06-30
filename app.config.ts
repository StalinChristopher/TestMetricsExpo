import { ConfigContext, ExpoConfig } from "expo/config";

type AppEnv = "development" | "staging" | "production";

/**
 * Native package / bundle id flavor. Uses APP_ENV from the shell or EAS (see package.json scripts).
 * Aliases: dev→development, qa→staging, prod→production. Unknown values default to development.
 * Do not put APP_ENV in .env files — it can shadow scripts and force the wrong flavor.
 *
 * `expo run:android` / `expo run:ios` reuse the last generated native project; they do not
 * rewrite applicationId from this file. When switching flavors, run `expo prebuild --clean` with the
 * same APP_ENV so native dirs and generated autolinking code match the new package id (package.json
 * wires `android:*` / `ios:*` to prebuild first; use `*:run` to skip prebuild for same-flavor rebuilds).
 */
function resolveAppEnv(): AppEnv {
  const raw = (process.env.APP_ENV ?? "").trim().toLowerCase();
  if (raw === "development" || raw === "dev") return "development";
  if (raw === "staging" || raw === "qa") return "staging";
  if (raw === "production" || raw === "prod") return "production";

  const profile = (process.env.EAS_BUILD_PROFILE ?? "").trim().toLowerCase();
  if (profile === "development") return "development";
  if (profile === "preview") return "staging";
  if (profile === "production") return "production";

  return "development";
}

const APP_ENV = resolveAppEnv();

/** Default API roots per flavor (keep in sync with eas.json `env` for each profile). */
const flavorApiBaseUrl: Record<AppEnv, string> = {
  development: "https://dev-api.example.com/",
  staging: "https://qa-api.example.com/",
  production: "https://api.example.com/",
};

/**
 * Local `expo start` / `expo run:*` often loads `.env.development`, which sets a single
 * EXPO_PUBLIC_API_BASE_URL — that would leak the dev URL into QA/Prod runs. On EAS,
 * `EXPO_PUBLIC_API_BASE_URL` and APP_ENV are set together per profile, so the env wins.
 */
function resolveApiBaseUrl(appEnv: AppEnv): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const onEas = Boolean(process.env.EAS_BUILD_PROFILE);
  if (onEas && fromEnv) return fromEnv;
  if (!onEas && appEnv === "development" && fromEnv) return fromEnv;
  return flavorApiBaseUrl[appEnv];
}

// Do not import dotenv here. Expo CLI loads `.env.*` before evaluating this file;
// a missing `dotenv` package would make config evaluation throw, and `expo prebuild`
// would fall back to `com.<expo-username>.<slug>` instead of the IDs below.

// ──────────────────────────────────────────────────────────────────────────────
// SCAFFOLD PLACEHOLDERS — do not edit these strings manually.
// The scaffolding tool (bin/index.js or the agentic SKILL) replaces:
//   "TestMetricsExpo"     → the real app name   (e.g. "MyApp")
//   "com.codeandtheory.testmetricsexpo" → the real package ID  (e.g. "com.example.myapp")
//   "testmetricsexpo"     → the lowercase slug   (e.g. "myapp")
// ──────────────────────────────────────────────────────────────────────────────
const flavors: Record<
  AppEnv,
  { name: string; androidPackage: string; iosBundleIdentifier: string }
> = {
  development: {
    name: "TestMetricsExpo Dev",
    androidPackage: "com.codeandtheory.testmetricsexpo.dev",
    iosBundleIdentifier: "com.codeandtheory.testmetricsexpo.dev",
  },
  staging: {
    name: "TestMetricsExpo QA",
    androidPackage: "com.codeandtheory.testmetricsexpo.qa",
    iosBundleIdentifier: "com.codeandtheory.testmetricsexpo.qa",
  },
  production: {
    name: "TestMetricsExpo",
    androidPackage: "com.codeandtheory.testmetricsexpo",
    iosBundleIdentifier: "com.codeandtheory.testmetricsexpo",
  },
};

const flavor = flavors[APP_ENV];

function mergeIosBackgroundModes(
  configIos: ExpoConfig['ios'] | undefined,
): string[] {
  const raw = configIos?.infoPlist?.UIBackgroundModes;
  const modes = Array.isArray(raw)
    ? raw.filter((m): m is string => typeof m === 'string')
    : [];
  return [...new Set([...modes, 'audio', 'picture-in-picture'])];
}

/** iOS treats missing or blank usage descriptions as invalid and can crash on first API use. */
function usageDescriptionOrDefault(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return fallback;
}

/** Ensures PiP works on Android after prebuild (MainActivity must declare supportsPictureInPicture). */
const ANDROID_PIP_PLUGIN = './plugins/withAndroidPip';

function mergeExpoPlugins(
  existing: ExpoConfig['plugins'] | undefined,
): NonNullable<ExpoConfig['plugins']> {
  const list = Array.isArray(existing) ? [...existing] : [];
  const hasPip = list.some(
    p =>
      p === ANDROID_PIP_PLUGIN ||
      (Array.isArray(p) && p[0] === ANDROID_PIP_PLUGIN),
  );
  if (!hasPip) {
    list.push(ANDROID_PIP_PLUGIN);
  }
  return list;
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  plugins: mergeExpoPlugins(config.plugins),
  name: flavor.name,
  slug: "testmetricsexpo",
  /** Must stay aligned with `src/navigation/linking.ts` (`deepLinkSchemePrefix` / `expo-linking` scheme — without `://`). */
  scheme: "exporn",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    ...(config.ios ?? {}),
    supportsTablet: true,
    bundleIdentifier: flavor.iosBundleIdentifier,
    infoPlist: (() => {
      const inherited =
        typeof config.ios?.infoPlist === 'object' &&
        config.ios.infoPlist !== null
          ? { ...config.ios.infoPlist }
          : {};
      return {
        ...inherited,
        NSCameraUsageDescription: usageDescriptionOrDefault(
          inherited.NSCameraUsageDescription,
          'This app uses the camera when you use features that need photo or video capture.',
        ),
        NSLocationWhenInUseUsageDescription: usageDescriptionOrDefault(
          inherited.NSLocationWhenInUseUsageDescription,
          'This app uses your location while open when you use features that need it.',
        ),
        UIBackgroundModes: mergeIosBackgroundModes(config.ios),
      };
    })(),
  },
  android: (() => {
    const rest = { ...(config.android ?? {}) };
    delete (rest as { package?: string }).package;
    return {
      ...rest,
      package: flavor.androidPackage,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    };
  })(),
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    ...(typeof config.extra === 'object' && config.extra !== null
      ? config.extra
      : {}),
    appEnv: APP_ENV,
    apiBaseUrl: resolveApiBaseUrl(APP_ENV),
  },
});
