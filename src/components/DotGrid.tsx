import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * The design's decorative dot grid, bottom-right of the Home header:
 * 14px pattern masked by radial-gradient(115% 115% at 100% 100%).
 * Dot opacity is computed from the same ellipse falloff.
 */
const W = 210;
const H = 96;
const RX = 1.15 * W;
const RY = 1.15 * H;

function dotOpacity(x: number, y: number): number {
  const dx = (x - W) / RX;
  const dy = (y - H) / RY;
  const d = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, Math.min(1, (0.7 - d) / 0.52));
}

function Dots() {
  const circles: React.ReactElement[] = [];
  for (let j = 0; j < 6; j++) {
    for (let i = 0; i < 18; i++) {
      const x = 1.75 + i * 12.25;
      const y = 2.4 + j * 16.8;
      const a = dotOpacity(x, y);
      if (a <= 0.02) continue;
      circles.push(
        <Circle key={`${i}-${j}`} cx={x} cy={y} r={1.45} fill="#41B6E5" fillOpacity={a} />,
      );
    }
  }
  return <>{circles}</>;
}

/** Floats slowly, matching the design's floatSlow keyframe. */
export function DotGrid() {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [t]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: -14 * t.value }, { scale: 1 + 0.06 * t.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: W,
          height: H,
          opacity: 0.5,
        },
        animated,
      ]}>
      <Svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ flex: 1 }}>
        <Dots />
      </Svg>
    </Animated.View>
  );
}
