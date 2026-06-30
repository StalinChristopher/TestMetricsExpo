export const BorderWidthToken = {
  'none': 0,
  'thin': 1,
  'thick': 2,
  'thickest': 4
} as const;
export type BorderWidthTokenKey = keyof typeof BorderWidthToken;