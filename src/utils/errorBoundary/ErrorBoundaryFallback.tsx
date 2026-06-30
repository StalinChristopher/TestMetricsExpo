import React from "react";
import { useTranslation } from "react-i18next";

import { ErrorStateView } from "../emptyErrorStates/ErrorStateView";

export type ErrorBoundaryFallbackProps = {
  error: Error | null;
  onRetry: () => void;
  embedded?: boolean;
};

export function ErrorBoundaryFallback({
  error: _error,
  onRetry,
  embedded = false,
}: ErrorBoundaryFallbackProps) {
  const { t } = useTranslation();

  return (
    <ErrorStateView
      title={t("errorBoundary.title")}
      message={t("errorBoundary.fallbackMessage")}
      retryLabel={t("errorBoundary.tryAgain")}
      onRetry={onRetry}
      layout={embedded ? "inline" : "fullscreen"}
    />
  );
}
