import i18n from "i18next";

import { localStorageImpl } from "../localstorage/LocalStorageImpl";
import type { SupportedLanguage } from "./supportedLanguages";

export function changeAppLanguage(lng: SupportedLanguage): void {
  localStorageImpl.setValue("app.locale", lng);
  void i18n.changeLanguage(lng);
}
