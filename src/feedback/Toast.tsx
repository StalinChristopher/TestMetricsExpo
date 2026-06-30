import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { BorderRadiusToken } from '../designSystem/generated/borderRadius';
import { SpacingToken } from '../designSystem/generated/spacing';
import { useAppTheme } from '../theme/ThemeContext';
import { useThemedStyles } from '../theme/useThemedStyles';
import { getFeedbackTypeBackground } from './feedbackTypeColors';
import type { ToastConfig } from './types';

interface ToastProps {
  config: ToastConfig | null;
  onDismiss: () => void;
}

export function Toast({ config, onDismiss }: ToastProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [animation] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));

  const styles = useThemedStyles(c => ({
    container: {
      position: 'absolute',
      left: SpacingToken.spacing_value_4,
      right: SpacingToken.spacing_value_4,
      backgroundColor: c.background,
      borderRadius: BorderRadiusToken.xl,
      ...Platform.select({
        ios: {
          shadowColor: c.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SpacingToken.spacing_value_4,
      paddingVertical: SpacingToken.spacing_value_3,
    },
    icon: {
      width: SpacingToken.spacing_value_8,
      height: SpacingToken.spacing_value_8,
      borderRadius: BorderRadiusToken.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SpacingToken.spacing_value_3,
    },
    textContainer: {
      flex: 1,
    },
    actionButton: {
      marginLeft: SpacingToken.spacing_value_3,
      paddingVertical: SpacingToken.spacing_value_1_5,
      paddingHorizontal: SpacingToken.spacing_value_3,
    },
  }));

  const dismissToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [animation, opacity, onDismiss]);

  useEffect(() => {
    if (config) {
      Animated.parallel([
        Animated.spring(animation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        dismissToast();
      }, config.duration || 3000);

      return () => clearTimeout(timer);
    } else {
      animation.setValue(0);
      opacity.setValue(0);
    }
  }, [config, animation, opacity, dismissToast]);

  if (!config) return null;

  const position = config.position || 'top';
  const iconColor = getFeedbackTypeBackground(config.type, colors);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: position === 'bottom' ? [100, 0] : [-100, 0],
  });

  const positionStyle =
    position === 'bottom'
      ? { bottom: insets.bottom + SpacingToken.spacing_value_4 }
      : { top: insets.top + SpacingToken.spacing_value_4 };

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <Pressable onPress={dismissToast} style={styles.content}>
        <View style={[styles.icon, { backgroundColor: iconColor }]}>
          <AppText variant="bodyMd" color="textOnPrimary" style={{ fontWeight: '700' }}>
            {getIcon(config.type || 'info')}
          </AppText>
        </View>
        <View style={styles.textContainer}>
          {config.title ? (
            <AppText variant="bodyMd" color="text1" style={{ fontWeight: '600', marginBottom: 2 }}>
              {config.title}
            </AppText>
          ) : null}
          <AppText variant="bodySm" color="text2">
            {config.message}
          </AppText>
        </View>
        {config.action && (
          <Pressable
            onPress={() => {
              config.action?.onPress?.();
              dismissToast();
            }}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={config.action.text}
          >
            <AppText
              variant="bodySm"
              color="primary"
              style={{ fontWeight: '700', textTransform: 'uppercase' }}
            >
              {config.action.text}
            </AppText>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

function getIcon(type: string): string {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '!';
    case 'info':
    default:
      return 'i';
  }
}
