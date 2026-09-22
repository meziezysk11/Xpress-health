import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

interface DashedBorderProps {
  radius?: number;
  color: string;
}

/** RN has no dashed borders — the design's dashed signature box as SVG. */
export function DashedBorder({ radius = 14, color }: DashedBorderProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
      {size && (
        <Svg style={{ flex: 1 }}>
          <Rect
            x={1}
            y={1}
            width={size.w - 2}
            height={size.h - 2}
            rx={radius}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="7 5"
          />
        </Svg>
      )}
    </View>
  );
}
