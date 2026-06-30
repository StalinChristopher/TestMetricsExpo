export const FontWeightToken = {
  'body-bold': 700,
  'body-light': 500,
  'body-medium': 500,
  'body-regular': 400,
  'display-bold': 700,
  'display-medium': 500,
  'display-super': 500,
  'heading-medium': 500,
  'label-bold': 700,
  'label-light': 500,
  'label-medium': 500,
  'label-regular': 400,
  'label-semibold': 500
} as const;
export type FontWeightTokenKey = keyof typeof FontWeightToken;