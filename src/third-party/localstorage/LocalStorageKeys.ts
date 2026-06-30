export const LocalStorageKeys = {
  "user.email": null,
  "app.theme": null,
  "app.locale": null,
} as const;

export type LocalStorageKey = keyof typeof LocalStorageKeys;
