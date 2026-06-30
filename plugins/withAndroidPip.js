/**
 * Expo config plugin: enable android:supportsPictureInPicture on MainActivity so
 * react-native-video PiP works after prebuild (Expo does not set this by default).
 */
const { withAndroidManifest, AndroidConfig } = require("@expo/config-plugins");

module.exports = function withAndroidPip(config) {
  return withAndroidManifest(config, (mod) => {
    try {
      const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(
        mod.modResults,
      );
      mainActivity.$["android:supportsPictureInPicture"] = "true";
    } catch {
      /* prebuild manifest shape may differ; try first launcher activity */
      try {
        const app = mod.modResults.manifest.application?.[0];
        const activities = app?.activity ?? [];
        for (const act of activities) {
          const intents = act["intent-filter"] ?? [];
          for (const inf of intents) {
            const actions = inf.action ?? [];
            const hasMain = actions.some(
              (a) => a.$?.["android:name"] === "android.intent.action.MAIN",
            );
            if (hasMain) {
              act.$ = act.$ ?? {};
              act.$["android:supportsPictureInPicture"] = "true";
              return mod;
            }
          }
        }
      } catch {
        /* skip */
      }
    }
    return mod;
  });
};
