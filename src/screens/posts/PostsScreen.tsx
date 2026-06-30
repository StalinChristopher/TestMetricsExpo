import { DrawerActions } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import type { Post } from "../../api/types/api";
import { AppList } from "../../components/AppList";
import { AppText } from "../../components/AppText";
import { AppTextInput } from "../../components/AppTextInput";
import { TopBar } from "../../components/TopBar";
import { APP_DISPLAY_NAME } from "../../config/appDisplayName";
import { BorderRadiusToken } from "../../designSystem/generated/borderRadius";
import { LineHeightToken } from "../../designSystem/generated/lineHeight";
import { SpacingToken } from "../../designSystem/generated/spacing";
import type { PostsMainCompositeProps } from "../../navigation/screenTypes";
import { useAppQuery } from "../../query/hooks/useAppQuery";
import { postService } from "../../services/postService";
import { useThemedStyles } from "../../theme/useThemedStyles";
import { InlineLoading } from "../../utils/loading";
import { EmptyStateView, ErrorStateView } from "../../utils/emptyErrorStates";

type Props = PostsMainCompositeProps;

type PostRowProps = {
  /** Post row data from the API. */
  item: Post;
};

const POST_ROW_ESTIMATED_HEIGHT =
  SpacingToken.spacing_value_3 * 2 +
  LineHeightToken.body_md +
  SpacingToken.spacing_value_1 +
  LineHeightToken.body_sm * 2;

function PostRow({ item }: PostRowProps) {
  const styles = useThemedStyles(
    colors => ({
      row: {
        paddingVertical: SpacingToken.spacing_value_3,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.grayBackground,
      },
      title: {
        fontWeight: "600",
      },
      body: {
        opacity: 0.75,
        marginTop: SpacingToken.spacing_value_1,
      },
    }),
    [],
  );

  return (
    <View style={styles.row}>
      <AppText variant="bodyMd" color="text1" style={styles.title}>
        {item.title}
      </AppText>
      <AppText variant="bodySm" color="text2" numberOfLines={2} style={styles.body}>
        {item.body}
      </AppText>
    </View>
  );
}

/** Posts screen with live search filtering by title and body. */
const PostsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: posts,
    isPending,
    error,
    refetch,
  } = useAppQuery(["posts"], () => postService.getPosts());

  const styles = useThemedStyles(
    colors => ({
      root: { flex: 1, backgroundColor: colors.background },
      container: {
        flex: 1,
        padding: SpacingToken.spacing_value_4,
        backgroundColor: colors.background,
      },
      centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: SpacingToken.spacing_value_4,
        backgroundColor: colors.background,
      },
      header: {
        marginBottom: SpacingToken.spacing_value_3,
      },
      searchInput: {
        marginBottom: SpacingToken.spacing_value_3,
        borderRadius: BorderRadiusToken.lg,
      },
      resultsLabel: {
        marginBottom: SpacingToken.spacing_value_2,
      },
    }),
    [],
  );

  const filteredPosts = useMemo(() => {
    if (!posts) {
      return [];
    }
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return posts;
    }
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query),
    );
  }, [posts, searchQuery]);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => <PostRow item={item} />,
    [],
  );

  const retryFetch = useCallback(() => void refetch(), [refetch]);

  const openMenu = useCallback(
    () => navigation.dispatch(DrawerActions.openDrawer()),
    [navigation],
  );

  const menuBar = <TopBar topBarTitle={APP_DISPLAY_NAME} onMenuPress={openMenu} />;

  if (isPending) {
    return (
      <View style={styles.root}>
        {menuBar}
        <View style={styles.centered}>
          <InlineLoading size="large" variant="spinner" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.root}>
        {menuBar}
        <View style={styles.centered}>
          <ErrorStateView
            title={t("errorBoundary.title")}
            message="Unable to load posts. Please check your connection and try again."
            retryLabel={t("errorBoundary.tryAgain")}
            onRetry={retryFetch}
            layout="fullscreen"
          />
        </View>
      </View>
    );
  }

  const trimmedQuery = searchQuery.trim();
  const hasResults = filteredPosts.length > 0;
  const isFiltering = trimmedQuery.length > 0;

  return (
    <View style={styles.root}>
      {menuBar}
      <View style={styles.container}>
        <AppText variant="headingSm" color="text1" style={styles.header}>
          {t("posts.title")}
        </AppText>
        <AppTextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("posts.searchPlaceholder")}
          accessibilityLabel={t("posts.searchPlaceholder")}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchInput}
        />
        {isFiltering ? (
          <AppText variant="bodySm" color="text2" style={styles.resultsLabel}>
            {t("posts.searchResultsFor", { query: trimmedQuery })}
          </AppText>
        ) : null}
        {!hasResults ? (
          <EmptyStateView
            title={isFiltering ? t("posts.noResults") : t("posts.empty")}
            description={
              isFiltering
                ? "Try a different keyword."
                : "There are no posts to display right now."
            }
            layout="inline"
          />
        ) : (
          <AppList<Post>
            data={filteredPosts}
            estimatedItemSize={POST_ROW_ESTIMATED_HEIGHT}
            keyExtractor={item => String(item.id)}
            renderItem={renderPost}
          />
        )}
      </View>
    </View>
  );
};

export default PostsScreen;
