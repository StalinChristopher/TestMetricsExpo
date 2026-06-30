import { createMMKV } from "react-native-mmkv";
import { LocalStorage } from "./LocalStorage";
import { LocalStorageKey } from "./LocalStorageKeys";

export const storage = createMMKV();

export const localStorageImpl: LocalStorage = {
  setValue: function (
    strKey: LocalStorageKey,
    value: string | number | boolean,
  ): void {
    storage.set(strKey, value);
  },

  getStringValue: function (strKey: LocalStorageKey): string | undefined {
    return storage.getString(strKey);
  },

  getNumberValue: function (strKey: LocalStorageKey): number | undefined {
    return storage.getNumber(strKey);
  },

  getBooleanValue: function (strKey: LocalStorageKey): boolean | undefined {
    return storage.getBoolean(strKey);
  },

  removeValue: function (strKey: LocalStorageKey): void {
    storage.remove(strKey);
  },

  clearStorage: function (): void {
    storage.clearAll();
  },
};
