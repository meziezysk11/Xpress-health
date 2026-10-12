import React, { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface PressableScaleProps extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Target scale while pressed (default 0.97 — subtle). */
  scaleTo?: number;
}

/**
 * Press feedback: quick scale-down on touch (120ms), release back (150ms).
 * Reanimated v3 shared values — no legacy Animated API.
 */
export function PressableScale({
  children,
  style,
  scaleTo = 0.97,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Layout props must sit on the Pressable itself, or the animated child
  // can't flex/align within the parent (e.g. two flex:1 buttons in a row).
  const { flex, flexGrow, flexShrink, flexBasis, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical, ...inner } =
    StyleSheet.flatten(style) ?? {};
  const outer = { flex, flexGrow, flexShrink, flexBasis, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical };

  return (
    <Pressable
      style={outer}
      onPressIn={() => {
        scale.value = withTiming(scaleTo, { duration: 120 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      {...rest}>
      <Animated.View style={[inner, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
