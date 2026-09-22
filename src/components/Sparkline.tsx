import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface SparklineProps {
  line: string;
  area: string;
  dot: { x: number; y: number };
}

/**
 * Weekly earnings sparkline — geometry identical to the design
 * (viewBox 0 0 92 26, blue line, gradient area, berry end dot).
 */
export function Sparkline({ line, area, dot }: SparklineProps) {
  return (
    <Svg
      viewBox="0 0 92 26"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 22, marginTop: 2, overflow: 'visible' }}>
      <Defs>
        <LinearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#015EB8" stopOpacity="0.22" />
          <Stop offset="1" stopColor="#015EB8" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={area} fill="url(#sparkFill)" />
      <Path
        d={line}
        fill="none"
        stroke="#015EB8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={dot.x} cy={dot.y} r={3} fill="#AE2573" />
    </Svg>
  );
}
