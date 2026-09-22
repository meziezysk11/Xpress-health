import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CIRCUMFERENCE = 94.2; // r=15

const timingConfig = {
  duration: 300,
  easing: Easing.bezier(0.16, 0.84, 0.28, 1),
};

/** 36×36 ring (design: #E4EFFA track, #41B6E5 arc, rounded caps). */
export function ProgressRing({ offset }: { offset: number }) {
  const progress = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(offset, timingConfig),
  }));

  return (
    <Svg viewBox="0 0 36 36" style={{ width: 32, height: 32, flexShrink: 0 }}>
      <Circle
        cx={18}
        cy={18}
        r={15}
        fill="none"
        stroke="#E4EFFA"
        strokeWidth={5}
      />
      <AnimatedCircle
        cx={18}
        cy={18}
        r={15}
        fill="none"
        stroke="#41B6E5"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        animatedProps={progress}
        transform="rotate(-90 18 18)"
      />
    </Svg>
  );
}
