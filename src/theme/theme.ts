/**
 * Design tokens extracted 1:1 from the Xpress Health design source
 * (design-reference/design-source.html). Do not approximate values.
 */

import { StyleSheet } from "react-native";

export const colors = {
  // Navy / ink
  navy950: '#061A38',
  navy900: '#0B2547',
  navy800: '#0D2D5E',
  navy700: '#123A72',
  heroBlue: '#0A6FCB',

  // Brand blue
  blue: '#015EB8',
  blueDeep: '#014A93',

  // Sky accent
  sky: '#41B6E5',
  skyLight: '#8FD6F2',

  // Berry accent
  berry: '#AE2573',
  berryDark: '#8E1F5D',
  berryMid: '#A8347A',
  pinkBg: '#FBE9F2',

  // Neutrals on light
  ink: '#0D2D5E',
  textMuted: '#5A6E8C',
  textMuted2: '#93A3BA',
  textSlate: '#3C5573',
  disabledText: '#7C8DA6',

  // On navy
  onNavyMuted: '#A9C8E8',
  onNavyMuted2: '#90AFD1',
  onNavyLight: '#D3E3F5',
  onNavyLight2: '#BFD8F0',
  onNavyLight3: '#DCEAF8',

  // Surfaces / borders
  bg: '#F4F7FB',
  pageBg: '#EDF1F7',
  white: '#FFFFFF',
  blueBg: '#E4EFFA',
  blueBorder: '#B9D5F0',
  inputBg: '#F9FBFD',
  border: '#DCE5EF',
  borderLight: '#EDF2F8',
  indicator: '#D5DEEA',
  signBorder: '#B7C6DA',

  // Status
  green: '#0F8A4D',
  red: '#C0392B',
  overlayWhite16: 'rgba(255,255,255,0.16)',
  overlayWhite28Border: 'rgba(255,255,255,0.28)',
  overlayWhite30Border: 'rgba(255,255,255,0.3)',
  overlayDark45: 'rgba(11,37,71,0.45)',

} as const;

/** Card elevation used across every white surface in the design. */
export const cardShadow = {
  shadowColor: 'rgba(13,45,94,0.14)',
  shadowOpacity: 1,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 1 },
} as const;

export const toastShadow = {
  shadowColor: 'rgba(11,37,71,0.6)',
  shadowOpacity: 1,
  shadowRadius: 30,
  shadowOffset: { width: 0, height: 12 },
} as const;

/**
 * CSS `linear-gradient(160deg, ...)` expressed as expo-linear-gradient
 * start/end points (unit square).
 */
export const gradient160 = {
  start: { x: 0.329, y: 0.03 },
  end: { x: 0.671, y: 0.97 },
} as const;

/** Fonts registered in App.tsx via @expo-google-fonts + Material Symbols. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  symbols: 'MaterialSymbolsRounded_500Medium',
} as const;

/** Shared easing from the design: cubic-bezier(.16,.84,.28,1). */
export const designBezier = [0.16, 0.84, 0.28, 1] as const;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  smd: 10,
  md: 12,
  mdl: 14,
  lg: 16,
  lgl: 18,
  xl: 20,
  xxl: 22,
  xxxl: 26,
};

export const radii = {
  xs: 7,
  sm: 9,
  smd: 10,
  md: 11,
  mdl: 12,
  lg: 13,
  lgl: 14,
  xl: 16,
  xxl: 18,
  round: 999,
};

export const buttons = StyleSheet.create({
  // "Sign in" / default "Clock in" (urgent) — solid, high-emphasis
  primary: {
    backgroundColor: colors.blue,
    borderRadius: radii.lgl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Urgent variant (not-yet-clocked-in state) uses magenta + a pulse animation
  // (Reanimated: scale/opacity loop) instead of actionBlue.
  primaryUrgent: {
    backgroundColor: colors.berry,
    borderRadius: radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // "Clock out" state (already clocked in) — translucent on dark header
  secondaryOnDark: {
    backgroundColor: colors.overlayWhite16,
    borderWidth: 1,
    borderColor: colors.overlayWhite28Border,
    borderRadius: radii.lg,
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // "Directions" — outline button on dark hero
  ghostOnDark: {
    borderWidth: 1.5,
    borderColor: colors.overlayWhite30Border,
    backgroundColor: colors.overlayDark45,
    borderRadius: radii.lg,
    paddingVertical: 14,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // "Use Face ID" — outline button on white
  outline: {
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: radii.lgl,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  outlineLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.navy800 },
  // Small pill button ("Reset")
  pillSmall: {
    backgroundColor: colors.sky,
    borderRadius: radii.sm,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  pillSmallLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, color: colors.navy800 },
  // "Clear filters" pill
  pillPrimary: {
    backgroundColor: colors.blue,
    borderRadius: radii.smd,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  pillPrimaryLabel: { fontFamily: 'Inter_700Bold', fontSize: 13, color: colors.white },
});
