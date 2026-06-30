import React from "react";
import { PostStackParamList } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostsScreen from "../../screens/posts/PostsScreen";
const Stack = createNativeStackNavigator<PostStackParamList>();

export function PostStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PostsMain" component={PostsScreen} />
    </Stack.Navigator>
  );
}
