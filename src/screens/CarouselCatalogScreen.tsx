import type { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, View } from "react-native";
import type { PanGesture } from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "../components/AppText";
import { TopBar } from "../components/TopBar";
import { BorderRadiusToken } from "../designSystem/generated/borderRadius";
import { FontSizeToken } from "../designSystem/generated/fontSize";
import { LineHeightToken } from "../designSystem/generated/lineHeight";
import { SpacingToken } from "../designSystem/generated/spacing";
import type { DrawerParamList } from "../navigation/types";
import { useAppTheme } from "../theme/ThemeContext";
import { useThemedStyles } from "../theme/useThemedStyles";

type CarouselCatalogNavProps = DrawerScreenProps<
  DrawerParamList,
  "CarouselCatalog"
>;

const SLIDE_INDICES = [0, 1, 2, 3, 4] as const;
const PEEK_WIDTH_RATIO = 0.78;
const PARALLAX_HEIGHT_RATIO = 0.42;
const STACK_HEIGHT_RATIO = 0.52;
/** Fixed vertical carousel height — closest spacing scale slot to legacy 200px. */
const VERTICAL_CAROUSEL_HEIGHT = SpacingToken.spacing_value_52;

/** Pan gesture tuning so horizontal carousels cooperate with the parent `ScrollView`. */
function configureHorizontalCarouselPan(gesture: PanGesture) {
  const n = SpacingToken.spacing_value_2_5;
  gesture.activeOffsetX([-n, n]);
}

/** Pan gesture tuning for vertical carousel inside a vertical `ScrollView`. */
function configureVerticalCarouselPan(gesture: PanGesture) {
  const n = SpacingToken.spacing_value_2_5;
  gesture.activeOffsetY([-n, n]);
}

type CarouselSlideProps = {
  index: number;
};

/**
 * Single carousel slide — separated so `renderItem` is not an inline function.
 */
function CarouselSlide({ index }: CarouselSlideProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const styles = useThemedStyles(
    () => ({
      slide: {
        flex: 1,
        borderRadius: BorderRadiusToken.xl,
        marginHorizontal: SpacingToken.spacing_value_2,
        alignItems: "center",
        justifyContent: "center",
        padding: SpacingToken.spacing_value_4,
      },
      slideText: {
        fontSize: FontSizeToken.body_lg,
        lineHeight: LineHeightToken.body_lg,
        fontWeight: "600",
        textAlign: "center",
      },
      slideHint: {
        marginTop: SpacingToken.spacing_value_2,
        fontSize: FontSizeToken.label_md,
        lineHeight: LineHeightToken.label_md,
        opacity: 0.9,
        textAlign: "center",
      },
    }),
    [],
  );

  const backgroundColor = useMemo(() => {
    switch (index % 4) {
      case 0:
        return colors.primary;
      case 1:
        return colors.secondary;
      case 2:
        return colors.success;
      default:
        return colors.primaryLight;
    }
  }, [
    colors.primary,
    colors.primaryLight,
    colors.secondary,
    colors.success,
    index,
  ]);

  const textColor = index % 4 === 3 ? "text1" : "textOnPrimary";

  return (
    <View style={[styles.slide, { backgroundColor }]} accessibilityRole="none">
      <AppText variant="bodyLg" color={textColor} style={styles.slideText}>
        {t("carouselCatalog.slideTitle", { n: index + 1 })}
      </AppText>
      <AppText variant="label" color={textColor} style={styles.slideHint}>
        {t("carouselCatalog.swipeHint")}
      </AppText>
    </View>
  );
}

/**
 * Drawer catalog demonstrating common `react-native-reanimated-carousel` layouts
 * (full-width, peek lane, parallax, stack, vertical) plus basic dot pagination.
 */
export function CarouselCatalogScreen({ navigation }: CarouselCatalogNavProps) {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const paginationProgress = useSharedValue(0);

  const styles = useThemedStyles(
    colors => ({
      safe: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scroll: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollContent: {
        padding: SpacingToken.spacing_value_5,
        paddingBottom: SpacingToken.spacing_value_14,
        gap: SpacingToken.spacing_value_6,
      },
      sectionTitle: {
        fontSize: FontSizeToken.body_lg,
        lineHeight: LineHeightToken.body_lg,
        fontWeight: "600",
        color: colors.text1,
        marginBottom: SpacingToken.spacing_value_2,
      },
      caption: {
        fontSize: FontSizeToken.body_sm,
        lineHeight: LineHeightToken.body_sm,
        color: colors.text2,
        marginBottom: SpacingToken.spacing_value_3,
      },
      carouselHost: {
        alignItems: "center",
      },
      sectionHint: {
        marginTop: SpacingToken.spacing_value_3,
        fontSize: FontSizeToken.label_md,
        lineHeight: LineHeightToken.label_md,
        color: colors.text3,
        textAlign: "center",
      },
      paginationContainer: {
        gap: SpacingToken.spacing_value_2,
        marginTop: SpacingToken.spacing_value_3,
      },
      paginationDot: {
        backgroundColor: colors.grayBackground,
        borderRadius: BorderRadiusToken.base,
      },
      paginationDotActive: {
        backgroundColor: colors.primary,
        borderRadius: BorderRadiusToken.base,
      },
    }),
    [],
  );

  const minCarouselWidth =
    SpacingToken.spacing_value_64 + SpacingToken.spacing_value_6;
  const fullWidth = Math.max(
    windowWidth - SpacingToken.spacing_value_5 * 2,
    minCarouselWidth,
  );
  const peekItemWidth = Math.round(fullWidth * PEEK_WIDTH_RATIO);
  const heightFull = Math.round(fullWidth * PARALLAX_HEIGHT_RATIO);
  const heightPeek = Math.round(peekItemWidth * 0.48);
  const heightParallax = Math.round(fullWidth * 0.46);
  const heightStack = Math.round(fullWidth * STACK_HEIGHT_RATIO);

  const renderItem = useCallback(
    ({ index }: { item: number; index: number }) => (
      <CarouselSlide index={index} />
    ),
    [],
  );

  const carouselData = useMemo(() => [...SLIDE_INDICES], []);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
      <TopBar
        topBarTitle={t("carouselCatalog.screenTitle")}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <AppText variant="bodyLg" color="text1" style={styles.sectionTitle}>
            {t("carouselCatalog.sectionFullWidth")}
          </AppText>
          <AppText variant="bodySm" color="text2" style={styles.caption}>
            {t("carouselCatalog.sectionFullWidthCaption")}
          </AppText>
          <View
            style={styles.carouselHost}
            accessibilityRole="none"
            accessibilityLabel={t("carouselCatalog.a11yFullWidth")}
          >
            <Carousel
              width={fullWidth}
              height={heightFull}
              data={carouselData}
              loop
              onProgressChange={paginationProgress}
              onConfigurePanGesture={configureHorizontalCarouselPan}
              renderItem={renderItem}
            />
          </View>
          <Pagination.Basic
            progress={paginationProgress}
            data={carouselData}
            horizontal
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            activeDotStyle={styles.paginationDotActive}
          />
          <AppText variant="label" color="text3" style={styles.sectionHint}>
            {t("carouselCatalog.paginationHint")}
          </AppText>
        </View>

        <View>
          <AppText variant="bodyLg" color="text1" style={styles.sectionTitle}>
            {t("carouselCatalog.sectionPeek")}
          </AppText>
          <AppText variant="bodySm" color="text2" style={styles.caption}>
            {t("carouselCatalog.sectionPeekCaption")}
          </AppText>
          <View
            style={styles.carouselHost}
            accessibilityRole="none"
            accessibilityLabel={t("carouselCatalog.a11yPeek")}
          >
            <Carousel
              width={peekItemWidth}
              height={heightPeek}
              data={carouselData}
              loop
              onConfigurePanGesture={configureHorizontalCarouselPan}
              renderItem={renderItem}
            />
          </View>
          <AppText variant="label" color="text3" style={styles.sectionHint}>
            {t("carouselCatalog.peekHint")}
          </AppText>
        </View>

        <View>
          <AppText variant="bodyLg" color="text1" style={styles.sectionTitle}>
            {t("carouselCatalog.sectionParallax")}
          </AppText>
          <AppText variant="bodySm" color="text2" style={styles.caption}>
            {t("carouselCatalog.sectionParallaxCaption")}
          </AppText>
          <View
            style={styles.carouselHost}
            accessibilityRole="none"
            accessibilityLabel={t("carouselCatalog.a11yParallax")}
          >
            <Carousel
              width={fullWidth}
              height={heightParallax}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: SpacingToken.spacing_value_12,
              }}
              data={carouselData}
              loop
              onConfigurePanGesture={configureHorizontalCarouselPan}
              renderItem={renderItem}
            />
          </View>
        </View>

        <View>
          <AppText variant="bodyLg" color="text1" style={styles.sectionTitle}>
            {t("carouselCatalog.sectionStack")}
          </AppText>
          <AppText variant="bodySm" color="text2" style={styles.caption}>
            {t("carouselCatalog.sectionStackCaption")}
          </AppText>
          <View
            style={styles.carouselHost}
            accessibilityRole="none"
            accessibilityLabel={t("carouselCatalog.a11yStack")}
          >
            <Carousel
              width={fullWidth}
              height={heightStack}
              mode="horizontal-stack"
              modeConfig={{
                stackInterval: SpacingToken.spacing_value_5,
                scaleInterval: 0.07,
                opacityInterval: 0.08,
              }}
              data={carouselData}
              loop
              onConfigurePanGesture={configureHorizontalCarouselPan}
              renderItem={renderItem}
            />
          </View>
        </View>

        <View>
          <AppText variant="bodyLg" color="text1" style={styles.sectionTitle}>
            {t("carouselCatalog.sectionVertical")}
          </AppText>
          <AppText variant="bodySm" color="text2" style={styles.caption}>
            {t("carouselCatalog.sectionVerticalCaption")}
          </AppText>
          <View
            style={styles.carouselHost}
            accessibilityRole="none"
            accessibilityLabel={t("carouselCatalog.a11yVertical")}
          >
            <Carousel
              vertical
              width={fullWidth}
              height={VERTICAL_CAROUSEL_HEIGHT}
              data={carouselData}
              loop={false}
              onConfigurePanGesture={configureVerticalCarouselPan}
              renderItem={renderItem}
            />
          </View>
          <AppText variant="label" color="text3" style={styles.sectionHint}>
            {t("carouselCatalog.verticalHint")}
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
