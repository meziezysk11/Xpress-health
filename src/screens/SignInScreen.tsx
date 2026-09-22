import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { colors, fonts } from '../theme/theme';
import { useApp } from '../state/AppStateContext';

/** The design's floatSlow keyframe for the hero orb. */
function FloatingOrb() {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5500 }),
        withTiming(0, { duration: 5500 }),
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
      style={[{ position: 'absolute', width: 300, height: 300, left: -70, top: -120 }, animated]}>
      <Svg viewBox="0 0 300 300" style={{ flex: 1 }}>
        <Defs>
          <RadialGradient id="orb">
            <Stop offset="0" stopColor="rgba(65,182,229,0.34)" />
            <Stop offset="0.7" stopColor="rgba(65,182,229,0)" />
            <Stop offset="1" stopColor="rgba(65,182,229,0)" />
          </RadialGradient>
        </Defs>
        <Circle cx={150} cy={150} r={150} fill="url(#orb)" />
      </Svg>
    </Animated.View>
  );
}

/** Radial backdrop: radial-gradient(130% 95% at 24% 14%, #0A6FCB, #0D2D5E 58%, #061A38). */
function HeroBackdrop() {
  return (
    <Svg
      viewBox="0 0 390 330"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient
          id="hero"
          cx={0}
          cy={0}
          r={1.3}
          gradientUnits="objectBoundingBox"
          gradientTransform="translate(0.24 0.14) scale(1 0.7308)">
          <Stop offset="0" stopColor="#0A6FCB" />
          <Stop offset="0.58" stopColor="#0D2D5E" />
          <Stop offset="1" stopColor="#061A38" />
        </RadialGradient>
      </Defs>
      <Rect width={390} height={330} fill="url(#hero)" />
    </Svg>
  );
}

export function SignInScreen() {
  const { dispatch } = useApp();

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <HeroBackdrop />
        <FloatingOrb />
        <ImageBackground
          source={require('../../assets/images/hero-care.jpg')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[
            'rgba(11,37,71,0.52)',
            'rgba(11,37,71,0.7)',
            'rgba(13,45,94,0.96)',
          ]}
          locations={[0, 0.5, 1]}
        />

        {/* Brand row + headline pinned to hero bottom */}
        <View style={styles.heroContent}>
          <View style={styles.brandRow}>
            <View style={styles.brandLogo}>
              <Icon name="health_and_safety" size={23} color={colors.blue} />
            </View>
            <Text style={styles.brandName}>Xpress Health</Text>
          </View>
          <View style={styles.headlineBlock}>
            <Text style={styles.headline}>Your shifts, on your terms</Text>
            <Text style={styles.subheadline}>
              Nursing and care work across Ireland — paid every Friday.
            </Text>
          </View>
        </View>
      </View>

      {/* Sign-in sheet */}
      <View style={styles.sheet}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              defaultValue="aoife.nolan@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputBox, styles.inputBoxActive]}>
            <TextInput
              style={[styles.input, styles.inputPassword]}
              defaultValue="password1"
              secureTextEntry
              textContentType="password"
            />
            <Icon name="visibility_off" size={20} color={colors.textMuted} />
          </View>
        </View>

        <View style={styles.rememberRow}>
          <View style={styles.rememberLeft}>
            <Icon name="check_box" size={19} color={colors.blue} />
            <Text style={styles.rememberText}>Keep me signed in</Text>
          </View>
          <PressableScale scaleTo={0.96}>
            <Text style={styles.forgot}>Forgot?</Text>
          </PressableScale>
        </View>

        <PressableScale
          onPress={() => dispatch({ type: 'SIGN_IN' })}
          style={styles.signInBtn}>
          <Text style={styles.signInText}>Sign in</Text>
        </PressableScale>
        <PressableScale
          onPress={() => dispatch({ type: 'SIGN_IN' })}
          style={styles.faceIdBtn}>
          <Icon name="fingerprint" size={20} color={colors.blue} />
          <Text style={styles.faceIdText}>Use Face ID</Text>
        </PressableScale>

        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.registerText}>
            New here?{' '}
            <Text style={styles.registerLink}>Register as a nurse or HCA</Text>
          </Text>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.navy800,
  },
  hero: {
    height: 330,
    flexShrink: 0,
  },
  heroContent: {
    position: 'absolute',
    left: 26,
    right: 26,
    top: 74,
    bottom: 32,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  brandLogo: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    letterSpacing: 2.08,
    color: colors.sky,
    textTransform: 'uppercase',
  },
  headlineBlock: {
    flexDirection: 'column',
    gap: 9,
  },
  headline: {
    fontSize: 31,
    lineHeight: 34.7,
    fontFamily: fonts.bold,
    letterSpacing: -1.085,
    color: colors.white,
  },
  subheadline: {
    fontSize: 13.5,
    lineHeight: 19.6,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -26,
    paddingTop: 28,
    paddingHorizontal: 26,
    paddingBottom: 22,
    gap: 14,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  inputBox: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    borderRadius: 13,
    paddingHorizontal: 15,
  },
  inputBoxActive: {
    borderColor: colors.blue,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.ink,
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  inputPassword: {
    flex: 1,
    letterSpacing: 3,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  forgot: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.berry,
  },
  signInBtn: {
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  faceIdBtn: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  faceIdText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  footer: {
    marginTop: 'auto',
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  registerText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  registerLink: {
    color: colors.berry,
    fontFamily: fonts.bold,
  },
  homeIndicator: {
    height: 5,
    width: 126,
    borderRadius: 3,
    backgroundColor: colors.indicator,
    marginHorizontal: 'auto',
    marginTop: 2,
  },
});
