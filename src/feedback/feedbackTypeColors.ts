import type { AppColors } from "../theme/AppColors";

export type FeedbackSeverity = "success" | "error" | "warning" | "info";

export function getFeedbackTypeBackground(
  type: FeedbackSeverity | string | undefined,
  colors: AppColors,
): string {
  switch (type) {
    case "success":
      return colors.success;
    case "error":
      return colors.error;
    case "warning":
      return colors.secondary;
    case "info":
    default:
      return colors.primary;
  }
}
