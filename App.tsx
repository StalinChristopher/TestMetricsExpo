import "./src/third-party/i18n/i18n";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedNavigationContainer } from "./src/navigation/ThemedNavigationContainer";
import { QueryProvider } from "./src/query/QueryProvider";
import { AppThemeProvider } from "./src/theme/ThemeContext";
import { ConnectivityProvider } from "./src/connectivity/ConnectivityHelper";
import { AppRootErrorBoundary } from "./src/utils/errorBoundary";
import { LoadingProvider } from "./src/utils/loading";
import { FeedbackProvider } from "./src/feedback";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <FeedbackProvider>
              <QueryProvider>
                <ConnectivityProvider>
                  <LoadingProvider>
                    <AppRootErrorBoundary>
                      <ThemedNavigationContainer />
                    </AppRootErrorBoundary>
                  </LoadingProvider>
                </ConnectivityProvider>
              </QueryProvider>
            </FeedbackProvider>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
