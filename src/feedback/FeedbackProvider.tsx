import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import type { SnackbarConfig, ToastConfig, AlertConfig } from "./types";
import { Snackbar } from "./Snackbar";
import { Toast } from "./Toast";
import { Alert } from "./Alert";
import { FeedbackManager } from "./FeedbackManager";

interface FeedbackProviderProps {
  children: React.ReactNode;
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const [snackbarConfig, setSnackbarConfig] = useState<SnackbarConfig | null>(
    null,
  );
  const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const handleSnackbar = useCallback((config: SnackbarConfig) => {
    setSnackbarConfig(config);
  }, []);

  const handleToast = useCallback((config: ToastConfig) => {
    setToastConfig(config);
  }, []);

  const handleAlert = useCallback((config: AlertConfig) => {
    setAlertConfig(config);
  }, []);

  React.useEffect(() => {
    FeedbackManager.setSnackbarCallback(handleSnackbar);
    FeedbackManager.setToastCallback(handleToast);
    FeedbackManager.setAlertCallback(handleAlert);
  }, [handleSnackbar, handleToast, handleAlert]);

  return (
    <View style={styles.container}>
      {children}
      <Snackbar
        config={snackbarConfig}
        onDismiss={() => setSnackbarConfig(null)}
      />
      <Toast config={toastConfig} onDismiss={() => setToastConfig(null)} />
      <Alert config={alertConfig} onDismiss={() => setAlertConfig(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
