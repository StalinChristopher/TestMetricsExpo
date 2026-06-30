import type { SnackbarConfig, ToastConfig, AlertConfig } from "./types";

type SnackbarCallback = (config: SnackbarConfig) => void;
type ToastCallback = (config: ToastConfig) => void;
type AlertCallback = (config: AlertConfig) => void;

class FeedbackManagerClass {
  private snackbarCallback: SnackbarCallback | null = null;
  private toastCallback: ToastCallback | null = null;
  private alertCallback: AlertCallback | null = null;

  setSnackbarCallback(callback: SnackbarCallback) {
    this.snackbarCallback = callback;
  }

  setToastCallback(callback: ToastCallback) {
    this.toastCallback = callback;
  }

  setAlertCallback(callback: AlertCallback) {
    this.alertCallback = callback;
  }

  showSnackbar(config: SnackbarConfig) {
    if (this.snackbarCallback) {
      this.snackbarCallback(config);
    }
  }

  showToast(config: ToastConfig) {
    if (this.toastCallback) {
      this.toastCallback(config);
    }
  }

  showAlert(config: AlertConfig) {
    if (this.alertCallback) {
      this.alertCallback(config);
    }
  }
}

export const FeedbackManager = new FeedbackManagerClass();
