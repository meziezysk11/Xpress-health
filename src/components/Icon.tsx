import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import { ICON_GLYPHS, IconName } from '../theme/glyphs';
import { fonts } from '../theme/theme';

interface IconProps extends Omit<TextProps, 'children'> {
  name: IconName;
  size?: number;
  color?: string;
}

/** Material Symbols Rounded glyph, weight 500 — the design's icon font. */
export function Icon({ name, size = 24, color, style, ...rest }: IconProps) {
  const textStyle: TextStyle = {
    fontFamily: fonts.symbols,
    fontSize: size,
    lineHeight: size,
    color,
  };
  return (
    <Text style={[textStyle, style]} {...rest}>
      {ICON_GLYPHS[name]}
    </Text>
  );
}
