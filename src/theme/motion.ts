import {
  EntryExitAnimationFunction,
  Easing,
  FadeOut,
  withTiming,
} from 'react-native-reanimated';

import { designBezier } from './theme';

const easing = Easing.bezier(...designBezier);

/**
 * The design's `screenIn`: opacity 0 → 1, translateY 10px → 0.
 * Kept at 240ms (design: 340ms) per the fast-transition requirement.
 */
export const screenEntering: EntryExitAnimationFunction = () => {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ translateY: 10 }] },
    animations: {
      opacity: withTiming(1, { duration: 240, easing }),
      transform: [{ translateY: withTiming(0, { duration: 240, easing }) }],
    },
  };
};

/** Slightly longer entrance for the sign-in screen (design: 500ms → 300ms). */
export const signInEntering: EntryExitAnimationFunction = () => {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ translateY: 10 }] },
    animations: {
      opacity: withTiming(1, { duration: 300, easing }),
      transform: [{ translateY: withTiming(0, { duration: 300, easing }) }],
    },
  };
};

export const screenExiting = FadeOut.duration(100);

/** The design's `toastIn`: opacity 0 → 1, translateY 14px → 0. */
export const toastEntering: EntryExitAnimationFunction = () => {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ translateY: 14 }] },
    animations: {
      opacity: withTiming(1, { duration: 260, easing }),
      transform: [{ translateY: withTiming(0, { duration: 260, easing }) }],
    },
  };
};

export const toastExiting = FadeOut.duration(150);
