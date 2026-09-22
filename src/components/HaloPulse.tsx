import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * The design's haloPulse keyframe (box-shadow ring) re-created as a scaling,
 * fading ring behind the Clock in button.
 */
export function HaloPulse({ radius = 13 }: { radius?: number }) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, [t]);

  const animated = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - t.value),
    transform: [{ scale: 1 + 0.18 * t.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[
          {
            flex: 1,
            borderRadius: radius,
            borderWidth: 6,
            borderColor: '#AE2573',
          },
          animated,
        ]}
      />
    </View>
  );
}
