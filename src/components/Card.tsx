import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { cardShadow, colors } from '../theme/theme';

interface CardProps extends ViewProps {
  radius?: number;
  /** Ring colour drawn by the 1px border of the design's box-shadow pair. */
  ringColor?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * The design's white surface:
 * box-shadow: 0 0 0 1px rgba(13,45,94,.06), 0 1px 2px rgba(13,45,94,.05)
 */
export function Card({
  radius = 16,
  ringColor = 'rgba(13,45,94,0.06)',
  style,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: ringColor,
          ...cardShadow,
        },
        style,
      ]}
      {...rest}
    />
  );
}
