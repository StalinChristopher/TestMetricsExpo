import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type {
  DrawerParamList,
  ExploreStackParamList,
  HomeStackParamList,
  MainTabParamList,
  PostStackParamList,
  ProfileStackParamList,
} from "./types";

type TabDrawerComposite = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList>,
  DrawerScreenProps<DrawerParamList>
>;

export type HomeMainCompositeProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, "HomeMain">,
  TabDrawerComposite
>;

export type ExploreMainCompositeProps = CompositeScreenProps<
  NativeStackScreenProps<ExploreStackParamList, "ExploreMain">,
  TabDrawerComposite
>;

export type ProfileMainCompositeProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, "ProfileMain">,
  TabDrawerComposite
>;

export type PostsMainCompositeProps = CompositeScreenProps<
  NativeStackScreenProps<PostStackParamList, "PostsMain">,
  TabDrawerComposite
>;
