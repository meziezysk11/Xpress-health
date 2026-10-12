import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { IconName } from '../theme/glyphs';
import { colors, fonts } from '../theme/theme';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'berry' | 'outline' | 'ghost';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS = {
  primary: { bg: colors.blue, fg: colors.white, border: colors.blue },
  berry: { bg: colors.berry, fg: colors.white, border: colors.berry },
  outline: { bg: colors.white, fg: colors.ink, border: colors.border },
  ghost: { bg: 'transparent', fg: colors.blue, border: 'transparent' },
} as const;

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style }: ButtonProps) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      onPress={onPress}
      disabled={inactive}
      scaleTo={inactive ? 1 : 0.97}
      style={[
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border, opacity: disabled && !loading ? 0.55 : 1 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon && <Icon name={icon} size={20} color={v.fg} />}
          <Text style={[styles.label, { color: v.fg }]}>{label}</Text>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  label: { fontSize: 16, fontFamily: fonts.bold },
});
