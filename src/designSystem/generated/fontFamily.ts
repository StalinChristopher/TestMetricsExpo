export const FontFamilyToken = {
  'body': "Inter",
  'display': "Druk Wide",
  'display-condensed': "Druk XCondensed",
  'heading': "Druk",
  'label': "Inter"
} as const;
export type FontFamilyTokenKey = keyof typeof FontFamilyToken;