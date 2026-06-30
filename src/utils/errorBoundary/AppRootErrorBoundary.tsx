import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState, type ReactNode } from "react";

import { ErrorBoundary } from "./ErrorBoundary";

type AppRootErrorBoundaryProps = {
  children: ReactNode;
};

export function AppRootErrorBoundary({ children }: AppRootErrorBoundaryProps) {
  const queryClient = useQueryClient();
  const [resetKey, setResetKey] = useState(0);

  const handleRecover = useCallback(() => {
    void queryClient.invalidateQueries();
    setResetKey(k => k + 1);
  }, [queryClient]);

  return (
    <ErrorBoundary key={resetKey} remountOnRetry onRecover={handleRecover}>
      {children}
    </ErrorBoundary>
  );
}
