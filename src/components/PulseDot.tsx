import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/** 5px dot with the design's livePulse: scale 1 → .72, opacity 1 → .35. */
export function PulseDot({ color = '#AE2573' }: { color?: string }) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, [t]);

  const animated = useAnimatedStyle(() => ({
    opacity: 1 - 0.65 * t.value,
    transform: [{ scale: 1 - 0.28 * t.value }],
  }));

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color }, animated]}
    />
  );
}

const styles = StyleSheet.create({
  dot: { width: 5, height: 5, borderRadius: 3 },
});
