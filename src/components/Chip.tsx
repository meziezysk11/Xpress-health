import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { fonts } from '../theme/theme';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

/**
 * Filter chip on the navy header.
 * on:  bg rgba(65,182,229,.16) · border rgba(65,182,229,.4) · #8FD6F2 bold
 * off: bg transparent · border rgba(255,255,255,.22) · #90AFD1 semibold
 */
export function Chip({ label, active, onPress }: ChipProps) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(65,182,229,0)', 'rgba(65,182,229,0.16)'],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255,255,255,0.22)', 'rgba(65,182,229,0.4)'],
    ),
  }));

  const animatedTextColor = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      ['#90AFD1', '#8FD6F2'],
    ),
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          {
            borderWidth: 1,
            borderRadius: 10,
            paddingVertical: 9,
            paddingHorizontal: 15,
          },
          animatedStyle,
        ]}>
        <Animated.Text
          style={[
            { fontSize: 13, fontFamily: fonts.bold },
            animatedTextColor,
          ]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
