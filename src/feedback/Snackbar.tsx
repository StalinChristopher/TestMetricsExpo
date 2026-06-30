import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { BorderRadiusToken } from '../designSystem/generated/borderRadius';
import { SpacingToken } from '../designSystem/generated/spacing';
import { useAppTheme } from '../theme/ThemeContext';
import { useThemedStyles } from '../theme/useThemedStyles';
import { getFeedbackTypeBackground } from './feedbackTypeColors';
import type { SnackbarConfig } from './types';

interface SnackbarProps {
  config: SnackbarConfig | null;
  onDismiss: () => void;
}

export function Snackbar({ config, onDismiss }: SnackbarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [animation] = useState(new Animated.Value(0));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const styles = useThemedStyles(c => ({
    container: {
      position: 'absolute',
      left: SpacingToken.spacing_value_4,
      right: SpacingToken.spacing_value_4,
      borderRadius: BorderRadiusToken.lg,
      ...Platform.select({
        ios: {
          shadowColor: c.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SpacingToken.spacing_value_4,
      paddingVertical: SpacingToken.spacing_value_3_5,
    },
    actionButton: {
      marginLeft: SpacingToken.spacing_value_4,
      paddingVertical: SpacingToken.spacing_value_1,
      paddingHorizontal: SpacingToken.spacing_value_3,
    },
  }));

  const dismissSnackbar = useCallback(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  }, [animation, onDismiss]);

  useEffect(() => {
    if (config) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();

      const duration = config.duration ?? 3000;
      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          dismissSnackbar();
        }, duration);
      }

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      animation.setValue(0);
    }
  }, [config, animation, dismissSnackbar]);

  if (!config) return null;

  const position = config.position || 'bottom';
  const backgroundColor = getFeedbackTypeBackground(config.type, colors);

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
        { backgroundColor, transform: [{ translateY }] },
      ]}
    >
      <Pressable onPress={dismissSnackbar} style={styles.content}>
        <AppText variant="bodySm" color="textOnPrimary" style={{ flex: 1, fontWeight: '500' }}>
          {config.message}
        </AppText>
        {config.action && (
          <Pressable
            onPress={() => {
              config.action?.onPress?.();
              dismissSnackbar();
            }}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={config.action.text}
          >
            <AppText
              variant="bodySm"
              color="textOnPrimary"
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
