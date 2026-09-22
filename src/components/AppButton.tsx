import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { PressableScale } from './PressableScale';
import { colors, fonts } from '../theme/theme';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  containerStyle?: StyleProp<any>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

/** Centred, pressable button — exact colours come from the screen's styles. */
export function AppButton({
  label,
  onPress,
  containerStyle,
  textStyle,
  disabled,
}: AppButtonProps) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo={disabled ? 1 : 0.97}
      style={[{ flexDirection: 'row' }, containerStyle]}>
      <Text style={[{ flex: 1, textAlign: 'center' }, textStyle]}>
        {label}
      </Text>
    </PressableScale>
  );
}

interface SolidButtonProps {
  label: string;
  onPress?: () => void;
  bg: string;
  color: string;
  fontSize?: number;
  fontWeight?: '400' | '500' | '600' | '700' | '800';
  paddingV?: number;
  radius?: number;
  borderWidth?: number;
  borderColor?: string;
  fontFamily?: string;
}

/** Convenience wrapper producing the design's solid/outline buttons. */
export function SolidButton({
  label,
  onPress,
  bg,
  color,
  fontSize = 16,
  fontWeight = '700',
  paddingV = 16,
  radius = 14,
  borderWidth,
  borderColor,
  fontFamily = fonts.bold,
}: SolidButtonProps) {
  return (
    <AppButton
      label={label}
      onPress={onPress}
      containerStyle={{
        backgroundColor: bg,
        borderRadius: radius,
        paddingVertical: paddingV,
        paddingHorizontal: 14,
        borderWidth,
        borderColor,
      }}
      textStyle={{
        color,
        fontSize,
        fontFamily,
        fontWeight,
      }}
    />
  );
}

export const pillText = (size: number): TextStyle => ({
  fontSize: size,
  fontFamily: fonts.medium,
  color: colors.ink,
});
