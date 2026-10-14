import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { useLogin } from '../api/queries';

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

export function SignInScreen({ onForgotPassword }: { onForgotPassword: () => void }) {
  const insets = useSafeAreaInsets();
  const login = useLogin();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const scrollRef = React.useRef<ScrollView>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;
  const submit = () => {
    if (!canSubmit || login.isPending) return;
    login.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        ref={scrollRef}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
            colors={['rgba(11,37,71,0.52)', 'rgba(11,37,71,0.7)', 'rgba(13,45,94,0.96)']}
            locations={[0, 0.5, 1]}
          />
          <View style={styles.heroContent}>
            <View style={styles.brandRow}>
              <View style={styles.brandLogo}>
                <Icon name="health_and_safety" size={23} color={colors.blue} />
              </View>
              <Text style={styles.brandName}>Achievers Professionals</Text>
            </View>
            <View style={styles.headlineBlock}>
              <Text style={styles.eyebrow}>Candidate portal</Text>
              <Text style={styles.headline}>Welcome to the Achievers candidate portal</Text>
              <Text style={styles.subheadline}>
                Track your job applications, update your profile, and discover matching NHS and
                private sector roles across the UK.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.sheetTitles}>
            <Text style={styles.sheetTitle}>Candidate sign in</Text>
            <Text style={styles.sheetSub}>Enter your credentials to access your dashboard.</Text>
          </View>

          {login.error && (
            <View style={styles.errorBanner} accessibilityLiveRegion="polite">
              <Icon name="error" size={19} color={colors.red} />
              <Text style={styles.errorText}>{login.error.message}</Text>
            </View>
          )}

          <TextField
            label="Email address"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <TextField
            ref={passwordRef}
            label="Password"
            icon="lock"
            password
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onFocus={(event) =>
              scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(
                event.nativeEvent.target,
                200,
              )
            }
            onSubmitEditing={submit}
          />

          <PressableScale scaleTo={0.96} onPress={onForgotPassword} style={styles.forgotWrap}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </PressableScale>

          <Button
            label="Sign in"
            onPress={submit}
            loading={login.isPending}
            disabled={!canSubmit}
          />
          {login.isPending && (
            <Text style={styles.hint}>Waking up the server — this can take up to a minute.</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: 1000
  },
  scroll: { flexGrow: 1, backgroundColor: colors.white },
  hero: {
    height: 360,
    backgroundColor: colors.navy800,
    flexShrink: 0,
  },
  heroContent: {
    position: 'absolute',
    left: 26,
    right: 26,
    top: 40,
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
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1.6,
    color: colors.sky,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 27,
    lineHeight: 31,
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
    paddingBottom: 28,
    gap: 16,
  },
  sheetTitles: { gap: 4 },
  sheetTitle: { fontSize: 21, fontFamily: fonts.bold, color: colors.ink, letterSpacing: -0.5 },
  sheetSub: { fontSize: 13.5, fontFamily: fonts.medium, color: colors.textMuted },
  errorBanner: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    padding: 12,
  },
  errorText: { flex: 1, fontSize: 13, lineHeight: 18, fontFamily: fonts.semiBold, color: colors.red },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -4 },
  forgot: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.berry },
  hint: { textAlign: 'center', fontSize: 12, fontFamily: fonts.medium, color: colors.textMuted },
});
