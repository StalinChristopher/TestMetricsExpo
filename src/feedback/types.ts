export type FeedbackType = "success" | "error" | "warning" | "info";

export type FeedbackPosition = "top" | "bottom";

export interface ActionButton {
  text: string;
  onPress?: () => void;
}

export interface SnackbarConfig {
  message: string;
  type?: FeedbackType;
  duration?: number; // 0 = fixed (won't auto-dismiss), > 0 = auto-dismiss
  position?: FeedbackPosition;
  action?: ActionButton; // Optional CTA button (e.g., "Undo", "OK")
}

export interface ToastConfig {
  title?: string;
  message: string;
  type?: FeedbackType;
  duration?: number;
  position?: FeedbackPosition;
  action?: ActionButton; // Optional CTA button
}

export interface AlertConfig {
  title: string;
  message: string;
  type?: FeedbackType;
  buttons?: AlertButton[]; // 1-3 buttons supported
}

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}
