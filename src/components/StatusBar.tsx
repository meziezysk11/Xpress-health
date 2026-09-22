import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/theme';

/**
 * Navy-coloured spacer that fills the device's status-bar area so screen
 * headers don't overlap the system UI. The real time / battery / signal are
 * shown by the native OS status bar.
 */
export function StatusBar() {
  const insets = useSafeAreaInsets();
  const height = Math.max(44, insets.top);

  return <View style={[styles.bar, { height }]} />;
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.navy800,
  },
});
