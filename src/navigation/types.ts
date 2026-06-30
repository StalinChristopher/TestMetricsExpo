import type { NavigatorScreenParams } from "@react-navigation/native";

export type HomeStackParamList = {
  HomeMain: undefined;
  HomeDetail: { itemId: string; title?: string };
};

export type ExploreStackParamList = {
  ExploreMain: undefined;
  ExploreDetail: { section: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: { from?: string } | undefined;
};

export type PostStackParamList = {
  PostsMain: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ExploreTab: NavigatorScreenParams<ExploreStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  PostsTab: NavigatorScreenParams<PostStackParamList>;
};

export type DrawerParamList = {
  TabRoot: NavigatorScreenParams<MainTabParamList>;
  Settings: ProfileStackParamList["Settings"];
  About: undefined;
  FeedbackCatalog: undefined;
  CarouselCatalog: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  ExampleModal: undefined;
  TransparentModal: { message?: string } | undefined;
  FullScreenModal: undefined;
};
