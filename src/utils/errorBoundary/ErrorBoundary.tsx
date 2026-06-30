import React, { type ReactNode } from "react";

import { ErrorBoundaryFallback } from "./ErrorBoundaryFallback";

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  onRecover?: () => void;
  remountOnRetry?: boolean;
  embeddedFallback?: boolean;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(): void {}

  handleRetry = (): void => {
    this.props.onRecover?.();
    if (this.props.remountOnRetry) {
      return;
    }
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <ErrorBoundaryFallback
            error={this.state.error}
            onRetry={this.handleRetry}
            embedded={this.props.embeddedFallback ?? false}
          />
        )
      );
    }

    return this.props.children;
  }
}
