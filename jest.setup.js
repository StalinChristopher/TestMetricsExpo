/* eslint-env jest */

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: { scheme: "exporn", slug: "testmetricsexpo" },
  },
}));

jest.mock("expo-linking", () => ({
  createURL: () => "exp://127.0.0.1/",
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock("@react-native-community/netinfo", () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    configure: jest.fn(),
    fetch: jest.fn(() =>
      Promise.resolve({
        type: "wifi",
        isConnected: true,
        isInternetReachable: true,
      }),
    ),
  },
}));

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);

jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Mock = ({ children, ...props }) => <View {...props}>{children}</View>;
  return {
    GestureHandlerRootView: Mock,
    PanGestureHandler: Mock,
    TapGestureHandler: Mock,
    State: {},
    ScrollView: View,
    NativeViewGestureHandler: Mock,
    gestureHandlerRootHOC: C => C,
    Directions: {},
  };
});

jest.mock("@gorhom/bottom-sheet", () => {
  return {
    BottomSheetModalProvider: ({ children }) => children,
    BottomSheetModal: () => null,
    BottomSheetBackdrop: () => null,
    BottomSheetView: ({ children }) => children,
    BottomSheetScrollView: ({ children }) => children,
  };
});

jest.mock("./src/navigation/RootNavigator", () => ({
  RootNavigator: () => null,
}));

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    NavigationContainer: React.forwardRef(({ children }, ref) => (
      <View ref={ref}>{children}</View>
    )),
    DefaultTheme: { colors: {} },
    DarkTheme: { colors: {} },
    createNavigationContainerRef: () => ({
      current: { navigate: jest.fn(), reset: jest.fn(), goBack: jest.fn() },
    }),
  };
});

jest.mock("react-native-mmkv", () => ({
  createMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  }),
}));

jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageTag: "en-US", languageCode: "en" }],
}));
