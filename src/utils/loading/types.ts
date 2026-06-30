export type LoadingSize = "small" | "medium" | "large";

export type LoadingVariant = "spinner" | "dots" | "pulse";

export interface LoadingConfig {
  message?: string;
  size?: LoadingSize;
  variant?: LoadingVariant;
  backgroundColor?: string;
  color?: string;
}

export interface SkeletonConfig {
  lines?: number;
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  animated?: boolean;
}

export interface InlineLoadingConfig {
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: string;
}
