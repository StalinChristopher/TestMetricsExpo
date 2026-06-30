export const BorderRadiusToken = {
  'none': 0,
  'sm': 2,
  'base': 4,
  'md': 6,
  'lg': 8,
  'xl': 12,
  'xl_2': 16,
  'xl_3': 24,
  'full': 9999
} as const;
export type BorderRadiusTokenKey = keyof typeof BorderRadiusToken;