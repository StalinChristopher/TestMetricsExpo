import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../components/AppButton";
import { AppText } from "../components/AppText";
import { SpacingToken } from "../designSystem/generated/spacing";
import { FeedbackManager } from "../feedback";
import { useAppTheme } from "../theme/ThemeContext";
import { useThemedStyles } from "../theme/useThemedStyles";
import { logger } from "../utils/logger";

export function FeedbackCatalogScreen() {
  const [undoCount, setUndoCount] = useState(0);
  const { colors } = useAppTheme();

  const styles = useThemedStyles(
    c => ({
      safeArea: {
        flex: 1,
        backgroundColor: c.background,
      },
      scrollView: {
        flex: 1,
        backgroundColor: c.background,
      },
      scroll: {
        padding: SpacingToken.spacing_value_5,
        paddingBottom:
          SpacingToken.spacing_value_12 + SpacingToken.spacing_value_6,
        paddingTop: SpacingToken.spacing_value_5,
        alignItems: "center",
      },
      title: {
        marginBottom: SpacingToken.spacing_value_10,
        alignSelf: "flex-start",
      },
      buttonContainer: {
        width: "100%",
        gap: SpacingToken.spacing_value_3,
        alignItems: "center",
      },
      catalogButton: {
        width: "90%",
      },
      hint: {
        marginTop: SpacingToken.spacing_value_6,
        alignSelf: "center",
      },
    }),
    [],
  );

  const showAutoDismissSnackbar = (
    type: "success" | "error" | "warning" | "info",
  ) => {
    FeedbackManager.showSnackbar({
      message: `Auto-dismiss ${type} snackbar (3s)`,
      type,
      duration: 3000,
      position: "bottom",
    });
  };

  const showFixedSnackbar = () => {
    FeedbackManager.showSnackbar({
      message: "Fixed snackbar - tap to dismiss",
      type: "info",
      duration: 0,
      position: "bottom",
    });
  };

  const showSnackbarWithUndo = () => {
    FeedbackManager.showSnackbar({
      message: "Item deleted",
      type: "info",
      duration: 5000,
      position: "bottom",
      action: {
        text: "UNDO",
        onPress: () => {
          setUndoCount(prev => prev + 1);
          FeedbackManager.showSnackbar({
            message: "Deletion undone",
            type: "success",
            duration: 2000,
          });
        },
      },
    });
  };

  const showSnackbarWithOK = () => {
    FeedbackManager.showSnackbar({
      message: "Settings saved successfully",
      type: "success",
      duration: 4000,
      position: "bottom",
      action: {
        text: "OK",
        onPress: () => {
          logger.debug("User acknowledged");
        },
      },
    });
  };

  const showToastWithCTA = (type: "success" | "error" | "warning" | "info") => {
    FeedbackManager.showToast({
      title:
        type === "success"
          ? "Success"
          : type === "error"
          ? "Error"
          : type === "warning"
          ? "Warning"
          : "Info",
      message: `Toast with ${type} type and action button`,
      type,
      duration: 5000,
      position: "top",
      action: {
        text: "VIEW",
        onPress: () => {
          logger.debug("View action pressed");
        },
      },
    });
  };

  const showToastWithUndo = () => {
    FeedbackManager.showToast({
      title: "Changes Applied",
      message: "Your changes have been saved",
      type: "info",
      duration: 5000,
      position: "top",
      action: {
        text: "UNDO",
        onPress: () => {
          setUndoCount(prev => prev + 1);
          FeedbackManager.showToast({
            title: "Reverted",
            message: "Changes have been undone",
            type: "success",
            duration: 2000,
          });
        },
      },
    });
  };

  const showToastWithOK = () => {
    FeedbackManager.showToast({
      title: "Update Available",
      message: "A new version is ready to install",
      type: "info",
      duration: 6000,
      position: "top",
      action: {
        text: "OK",
        onPress: () => {
          logger.debug("Acknowledged");
        },
      },
    });
  };

  const showSingleButtonAlert = (
    type: "success" | "error" | "warning" | "info",
  ) => {
    FeedbackManager.showAlert({
      title:
        type === "success"
          ? "Success!"
          : type === "error"
          ? "Error"
          : type === "warning"
          ? "Warning"
          : "Information",
      message: `This is a single button alert with ${type} type. Tap OK to dismiss.`,
      type,
      buttons: [{ text: "OK", style: "default" }],
    });
  };

  const showTwoButtonAlert = () => {
    FeedbackManager.showAlert({
      title: "Confirm Action",
      message: "Are you sure you want to proceed with this action?",
      type: "warning",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          style: "default",
          onPress: () => {
            FeedbackManager.showSnackbar({
              message: "Action confirmed",
              type: "success",
            });
          },
        },
      ],
    });
  };

  const showThreeButtonAlert = () => {
    FeedbackManager.showAlert({
      title: "Choose an Option",
      message: "How would you like to proceed?",
      type: "info",
      buttons: [
        {
          text: "Option A",
          style: "default",
          onPress: () => {
            FeedbackManager.showSnackbar({
              message: "Option A selected",
              type: "info",
            });
          },
        },
        {
          text: "Option B",
          style: "default",
          onPress: () => {
            FeedbackManager.showSnackbar({
              message: "Option B selected",
              type: "info",
            });
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
    });
  };

  const showDestructiveAlert = () => {
    FeedbackManager.showAlert({
      title: "Delete Account",
      message:
        "This will permanently delete your account and all data. This action cannot be undone.",
      type: "error",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            FeedbackManager.showSnackbar({
              message: "Account deletion cancelled (demo)",
              type: "info",
            });
          },
        },
      ],
    });
  };

  const catalogButtons: {
    label: string;
    onPress: () => void;
    color: string;
  }[] = [
    {
      label: "Toast View - Success",
      onPress: () => showToastWithCTA("success"),
      color: colors.error,
    },
    {
      label: "Toast View - Error",
      onPress: () => showToastWithCTA("error"),
      color: colors.error,
    },
    {
      label: "Toast View - Info",
      onPress: () => showToastWithCTA("info"),
      color: colors.error,
    },
    {
      label: "Toast with Undo",
      onPress: showToastWithUndo,
      color: colors.error,
    },
    { label: "Toast with OK", onPress: showToastWithOK, color: colors.error },
    {
      label: "Fixed Snackbar View",
      onPress: showFixedSnackbar,
      color: colors.primary,
    },
    {
      label: "Auto Dismiss Snackbar - Success",
      onPress: () => showAutoDismissSnackbar("success"),
      color: colors.primary,
    },
    {
      label: "Auto Dismiss Snackbar - Error",
      onPress: () => showAutoDismissSnackbar("error"),
      color: colors.primary,
    },
    {
      label: "Auto Dismiss Snackbar - Info",
      onPress: () => showAutoDismissSnackbar("info"),
      color: colors.primary,
    },
    {
      label: "Snackbar with Undo",
      onPress: showSnackbarWithUndo,
      color: colors.primary,
    },
    {
      label: "Snackbar with OK",
      onPress: showSnackbarWithOK,
      color: colors.primary,
    },
    {
      label: "Single Button Alert - Success",
      onPress: () => showSingleButtonAlert("success"),
      color: colors.success,
    },
    {
      label: "Single Button Alert - Error",
      onPress: () => showSingleButtonAlert("error"),
      color: colors.success,
    },
    {
      label: "Single Button Alert - Info",
      onPress: () => showSingleButtonAlert("info"),
      color: colors.success,
    },
    {
      label: "Two Button Alert View",
      onPress: showTwoButtonAlert,
      color: colors.success,
    },
    {
      label: "Three Button Alert View",
      onPress: showThreeButtonAlert,
      color: colors.success,
    },
    {
      label: "Destructive Alert (demo)",
      onPress: showDestructiveAlert,
      color: colors.success,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
      >
        <AppText variant="headingSm" color="text1" style={styles.title}>
          Feedback
        </AppText>

        <View style={styles.buttonContainer}>
          {catalogButtons.map(button => (
            <AppButton
              key={button.label}
              label={button.label}
              onPress={button.onPress}
              style={[styles.catalogButton, { backgroundColor: button.color }]}
            />
          ))}
          <AppText variant="bodySm" color="text2" style={styles.hint}>
            Undo actions (demo): {undoCount}
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
