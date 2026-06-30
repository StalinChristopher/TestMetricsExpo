import type { LinkingOptions } from "@react-navigation/native";
import * as ExpoLinking from "expo-linking";

import type { RootStackParamList } from "./types";

/**
 * Deep linking — scheme must match `scheme` in app.config.ts / app.json.
 * Prefixes include Expo's canonical URL (`createURL`) plus the explicit scheme for CLI tools.
 * Test: npx uri-scheme open exporn://home --ios
 */
export const deepLinkSchemePrefix = "exporn://";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [ExpoLinking.createURL("/"), deepLinkSchemePrefix],
  async getInitialURL() {
    return ExpoLinking.getInitialURL();
  },
  subscribe(listener) {
    const subscription = ExpoLinking.addEventListener("url", ({ url }) => {
      listener(url);
    });
    return () => subscription.remove();
  },
  config: {
    screens: {
      Main: {
        screens: {
          TabRoot: {
            screens: {
              HomeTab: {
                screens: {
                  HomeMain: "home",
                  HomeDetail: "home/detail/:itemId",
                },
              },
              ExploreTab: {
                screens: {
                  ExploreMain: "explore",
                  ExploreDetail: "explore/detail/:section",
                },
              },
              ProfileTab: {
                screens: {
                  ProfileMain: "profile",
                  Settings: "profile/settings",
                },
              },
              PostsTab: {
                screens: {
                  PostsMain: "posts",
                },
              },
            },
          },
          About: "about",
          CarouselCatalog: "carousel",
        },
      },
      ExampleModal: "modal/presentation",
      TransparentModal: "modal/transparent",
      FullScreenModal: "modal/fullscreen",
    },
  },
};
