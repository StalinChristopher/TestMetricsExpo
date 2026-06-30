import { createNavigationContainerRef } from "@react-navigation/native";

import type { RootStackParamList } from "./types";

/** Use for imperative navigation from deep screens (e.g. open a root-level modal). */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
