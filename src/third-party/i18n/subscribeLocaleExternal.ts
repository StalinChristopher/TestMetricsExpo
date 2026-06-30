import i18n from "i18next";
import type { AppStateStatus } from "react-native";
import { AppState } from "react-native";

import { localStorageImpl } from "../localstorage/LocalStorageImpl";
import { getDeviceLanguageTag } from "./getDeviceLanguageTag";
import { matchSupportedLanguage } from "./supportedLanguages";

export function registerLocaleExternalChangeListeners(): () => void {
  const onChange = (next: AppStateStatus) => {
    if (next !== "active") {
      return;
    }
    if (localStorageImpl.getStringValue("app.locale")) {
      return;
    }
    const device = matchSupportedLanguage(getDeviceLanguageTag());
    if (device !== i18n.language) {
      void i18n.changeLanguage(device);
    }
  };
  const sub = AppState.addEventListener("change", onChange);
  return () => sub.remove();
}
