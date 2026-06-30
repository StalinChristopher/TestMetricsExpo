import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { View, Text, StatusBar } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";

import { FontSizeToken } from "../designSystem/generated/fontSize";
import { LineHeightToken } from "../designSystem/generated/lineHeight";
import { SpacingToken } from "../designSystem/generated/spacing";
import { useAppTheme } from "../theme/ThemeContext";
import { useThemedStyles } from "../theme/useThemedStyles";

// 1. Define the Context Shape
interface ConnectivityContextType {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}

const ConnectivityContext = createContext<ConnectivityContextType>({
  isConnected: true,
  isInternetReachable: true,
});

interface Props {
  children: ReactNode;
}

const ConnectivityOfflineView = React.memo(function ConnectivityOfflineView() {
  const { theme } = useAppTheme();
  const styles = useThemedStyles(
    c => ({
      errorContainer: {
        flex: 1,
        backgroundColor: c.background,
        justifyContent: "center",
        alignItems: "center",
      },
      content: {
        paddingHorizontal: SpacingToken.spacing_value_10,
        alignItems: "center",
      },
      icon: {
        fontSize: FontSizeToken.display_md,
        marginBottom: SpacingToken.spacing_value_5,
      },
      title: {
        fontSize: FontSizeToken.heading_md,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: SpacingToken.spacing_value_3,
        color: c.text1,
      },
      message: {
        fontSize: FontSizeToken.body_md,
        lineHeight: LineHeightToken.body_md,
        textAlign: "center",
        color: c.text2,
      },
    }),
    [],
  );

  const statusBarStyle = theme === "dark" ? "light-content" : "dark-content";

  return (
    <SafeAreaView style={styles.errorContainer}>
      <StatusBar barStyle={statusBarStyle} />
      <View style={styles.content}>
        <Text style={styles.icon}>📶</Text>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.message}>
          Please check your internet connection and try again.
        </Text>
      </View>
    </SafeAreaView>
  );
});

export const ConnectivityProvider: React.FC<Props> = ({ children }) => {
  const [netState, setNetState] = useState<ConnectivityContextType>({
    isConnected: true,
    isInternetReachable: true,
  });

  const handleNetInfo = useCallback((state: NetInfoState) => {
    setNetState({
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleNetInfo);
    return () => unsubscribe();
  }, [handleNetInfo]);

  // 3. Render logic: If connection is explicitly false, show error
  // We check isConnected (physical link) and isInternetReachable (actual ping)
  if (
    netState.isConnected === false ||
    netState.isInternetReachable === false
  ) {
    return <ConnectivityOfflineView />;
  }

  return (
    <ConnectivityContext.Provider value={netState}>
      {children}
    </ConnectivityContext.Provider>
  );
};

// Custom hook to use connectivity status in any component
export const useConnectivity = () => useContext(ConnectivityContext);
