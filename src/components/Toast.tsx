import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import { Icon } from './Icon';
import { colors, fonts, toastShadow } from '../theme/theme';
import { toastEntering } from '../theme/motion';
import { ToastMessage } from '../state/stores/toastStore';

/**
 * The design's floating confirmation toast:
 * navy pill, check_circle in sky, positioned 110px above the bottom.
 */
export function Toast({ toast }: { toast: ToastMessage }) {
  return (
    <View pointerEvents="none" style={styles.anchor}>
      <Animated.View
        entering={toastEntering}
        exiting={FadeOut.duration(150)}
        style={[styles.toast, toastShadow]}>
        <Icon
          name={toast.kind === 'error' ? 'error' : 'check_circle'}
          size={20}
          color={toast.kind === 'error' ? '#F4A3C9' : colors.sky}
        />
        <Text style={styles.text} accessibilityLiveRegion="polite">
          {toast.message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 100,
  },
  toast: {
    backgroundColor: colors.navy900,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  text: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 13.5 * 1.35,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
});
