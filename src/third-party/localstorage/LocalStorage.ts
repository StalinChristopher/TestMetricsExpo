import { LocalStorageKey } from "./LocalStorageKeys";

export interface LocalStorage {
  setValue: <T extends string | number | boolean>(
    strKey: LocalStorageKey,
    value: T,
  ) => void;
  getStringValue: (strKey: LocalStorageKey) => string | undefined;
  getNumberValue: (strKey: LocalStorageKey) => number | undefined;
  getBooleanValue: (strKey: LocalStorageKey) => boolean | undefined;
  removeValue: (strKey: LocalStorageKey) => void;
  clearStorage: () => void;
}
