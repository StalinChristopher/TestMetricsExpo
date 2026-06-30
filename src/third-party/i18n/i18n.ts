import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { localStorageImpl } from "../localstorage/LocalStorageImpl";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import { getDeviceLanguageTag } from "./getDeviceLanguageTag";
import { registerLocaleExternalChangeListeners } from "./subscribeLocaleExternal";
import { resolveInitialLanguage } from "./supportedLanguages";

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: resolveInitialLanguage(
    localStorageImpl.getStringValue("app.locale"),
    getDeviceLanguageTag(),
  ),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  compatibilityJSON: "v4",
});

registerLocaleExternalChangeListeners();

export { i18n };
