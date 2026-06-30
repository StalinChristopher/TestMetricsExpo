import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import type { LoadingConfig } from "./types";
import { LoadingOverlay } from "./LoadingOverlay";
import { LoadingManager } from "./LoadingManager";

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig | null>(
    null,
  );

  const handleLoading = useCallback((config: LoadingConfig | null) => {
    setLoadingConfig(config);
  }, []);

  React.useEffect(() => {
    LoadingManager.setLoadingCallback(handleLoading);
  }, [handleLoading]);

  return (
    <View style={styles.container}>
      {children}
      <LoadingOverlay config={loadingConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
