import React from 'react';
import { AccessibilityInfo, Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { cancelAnimation, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Icon } from '../components/Icon';
import { IconName } from '../theme/glyphs';
import { colors, fonts } from '../theme/theme';

const slides: { eyebrow: string; title: string; description: string; icon: IconName; cardTitle: string; cardDetail: string; badge: string; accent: string; image: ImageSourcePropType }[] = [
  { image: require('../../assets/images/welcome-shifts.jpg'), eyebrow: 'WORK THAT FITS YOUR LIFE', title: 'Your next shift.\nYour choice.', description: 'Discover nursing and care shifts across Ireland. Find the location, hours and rate that work for you.', icon: 'search', cardTitle: 'Find your perfect shift', cardDetail: 'Explore shifts • Filter by location • Book', badge: 'More choice. More flexibility.', accent: colors.sky },
  { image: require('../../assets/images/welcome-schedule.jpg'), eyebrow: 'MAKE ROOM FOR WHAT MATTERS', title: 'A little planning.\nA lot more freedom.', description: 'Keep your booked shifts and availability together. See what’s coming up and plan your week with confidence.', icon: 'calendar_month', cardTitle: 'Your week, organised', cardDetail: 'Upcoming shifts • Availability • Schedule', badge: 'Everything in one place.', accent: colors.sky },
  { image: require('../../assets/images/welcome-timesheets.jpg'), eyebrow: 'FROM CLOCK IN TO PAYDAY', title: 'Great care.\nLess paperwork.', description: 'Clock in and out, submit your timesheets and keep track of your earnings. Stay on top of every shift.', icon: 'receipt_long', cardTitle: 'Every hour accounted for', cardDetail: 'Clock in • Timesheets • Earnings', badge: 'Focus on the care you give.', accent: colors.berry },
];

function FeatureArtwork({ slide, reducedMotion }: { slide: typeof slides[number]; reducedMotion: boolean }) {
  const float = useSharedValue(0);
  React.useEffect(() => {
    if (reducedMotion) { cancelAnimation(float); float.value = 0; return; }
    float.value = withRepeat(withSequence(withTiming(1, { duration: 2600 }), withTiming(0, { duration: 2600 })), -1);
    return () => cancelAnimation(float);
  }, [float, reducedMotion]);
  const photoMotion = useAnimatedStyle(() => ({ transform: [{ scale: 1.04 + float.value * 0.04 }, { translateY: -float.value * 5 }] }));
  const cardMotion = useAnimatedStyle(() => ({ transform: [{ translateY: -float.value * 9 }, { rotate: `${-2 + float.value * 2}deg` }] }));
  const badgeMotion = useAnimatedStyle(() => ({ transform: [{ translateY: float.value * 6 }] }));
  return (
    <View style={styles.artwork} accessible accessibilityLabel="Healthcare professionals, with a preview of the app’s features">
      <View style={[styles.orbit, { borderColor: slide.accent }]} />
      <View style={styles.photoFrame}>
        <Animated.View style={[StyleSheet.absoluteFill, photoMotion]}>
          <Image source={slide.image} style={styles.photo} resizeMode="cover" />
        </Animated.View>
        <LinearGradient colors={['transparent', 'rgba(6,26,56,0.8)']} style={StyleSheet.absoluteFill} />
        <Text style={styles.photoLabel}>Made for people who care.</Text>
      </View>
      <Animated.View style={[styles.badge, badgeMotion]}>
        <Icon name="verified" size={19} color={colors.sky} />
        <Text style={styles.badgeText}>{slide.badge}</Text>
      </Animated.View>
      <Animated.View style={[styles.featureCard, cardMotion]}>
        <View style={[styles.featureIcon, { backgroundColor: slide.accent === colors.berry ? colors.pinkBg : colors.blueBg }]}>
          <Icon name={slide.icon} size={30} color={slide.accent === colors.berry ? colors.berry : colors.blue} />
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>{slide.cardTitle}</Text>
          <Text style={styles.cardDetail}>{slide.cardDetail}</Text>
        </View>
        <Icon name="check_circle" size={22} color={colors.green} />
      </Animated.View>
    </View>
  );
}

export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);
  const [autoAdvance, setAutoAdvance] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(true);
  React.useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReducedMotion(value); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => { active = false; subscription.remove(); };
  }, []);
  React.useEffect(() => {
    if (!autoAdvance || reducedMotion || index === slides.length - 1) return;
    const timer = setTimeout(() => setIndex(current => Math.min(current + 1, slides.length - 1)), 7000);
    return () => clearTimeout(timer);
  }, [index, autoAdvance, reducedMotion]);
  const navigate = (next: number) => { setAutoAdvance(false); setIndex(next); };
  const slide = slides[index];
  return (
    <LinearGradient colors={[colors.navy800, colors.navy950]} style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <View style={styles.brand}><View style={styles.logo}><Icon name="health_and_safety" size={23} color={colors.blue} /></View><Text style={styles.brandName}>Xpress Health</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Skip welcome and go to sign in" onPress={onComplete} style={styles.skip}><Text style={styles.skipText}>Skip intro</Text><Icon name="arrow_forward" size={17} color={colors.onNavyLight} /></Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Animated.View key={`art-${index}`} entering={reducedMotion ? undefined : FadeInUp.duration(650)}>
          <FeatureArtwork slide={slide} reducedMotion={reducedMotion} />
        </Animated.View>
        <Animated.View key={`copy-${index}`} entering={reducedMotion ? undefined : FadeInDown.duration(550).delay(150)} style={styles.copy}>
          <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
          <Text accessibilityRole="header" style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.progressRow}>
          <View style={styles.dots}>{slides.map((_, position) => <Pressable key={position} accessibilityRole="button" accessibilityLabel={`Show slide ${position + 1} of ${slides.length}`} accessibilityState={{ selected: index === position }} onPress={() => navigate(position)} style={styles.dotHit}><View style={[styles.dot, index === position && styles.activeDot]} /></Pressable>)}</View>
        </View>
        <View style={styles.actions}>
          {index > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Previous slide" onPress={() => navigate(index - 1)} style={styles.back}><Icon name="arrow_back" size={22} color={colors.white} /></Pressable>}
          <Pressable accessibilityRole="button" onPress={() => index === slides.length - 1 ? onComplete() : navigate(index + 1)} style={styles.next}><Text style={styles.nextText}>{index === slides.length - 1 ? 'Get started' : 'Next'}</Text><Icon name="arrow_forward" size={22} color={colors.white} /></Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: { backgroundColor: colors.white, padding: 8, borderRadius: 12 },
  brandName: { fontFamily: fonts.bold, fontSize: 15, color: colors.white },
  skip: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 },
  skipText: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.onNavyLight },
  body: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 26, paddingBottom: 18, width: '100%', maxWidth: 560, alignSelf: 'center' },
  artwork: { height: 300, marginTop: 10, marginBottom: 28 },
  orbit: { position: 'absolute', width: 260, height: 260, borderRadius: 140, borderWidth: 1, opacity: 0.25, alignSelf: 'center', top: 8, transform: [{ scaleX: 1.16 }] },
  photoFrame: { position: 'absolute', top: 14, bottom: 28, left: 18, right: 18, borderRadius: 30, overflow: 'hidden', backgroundColor: colors.heroBlue },
  photo: { width: '100%', height: '100%' },
  photoLabel: { position: 'absolute', bottom: 50, left: 18, color: colors.white, fontFamily: fonts.semiBold, fontSize: 13 },
  badge: { position: 'absolute', top: 0, right: 0, borderWidth: 1, borderColor: colors.overlayWhite28Border, backgroundColor: colors.navy800, borderRadius: 30, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 7 },
  badgeText: { color: colors.white, fontFamily: fonts.medium, fontSize: 11 },
  featureCard: { position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 19, backgroundColor: colors.white, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: colors.navy950, shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  featureIcon: { padding: 10, borderRadius: 14 },
  cardCopy: { flex: 1, gap: 5 },
  cardTitle: { fontFamily: fonts.bold, color: colors.ink, fontSize: 14 },
  cardDetail: { fontFamily: fonts.medium, color: colors.textMuted, fontSize: 10, lineHeight: 15 },
  copy: { gap: 14 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.8, color: colors.sky },
  title: { fontFamily: fonts.extraBold, fontSize: 35, lineHeight: 41, letterSpacing: -1.3, color: colors.white },
  description: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 24, color: colors.onNavyLight2 },
  footer: { paddingHorizontal: 26, paddingBottom: 16, width: '100%', maxWidth: 560, alignSelf: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  dots: { flexDirection: 'row' },
  dotHit: { minWidth: 30, height: 44, justifyContent: 'center', alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.onNavyMuted2 },
  activeDot: { width: 23, backgroundColor: colors.sky },
  counter: { fontFamily: fonts.medium, fontSize: 12, color: colors.onNavyMuted },
  actions: { flexDirection: 'row', gap: 12 },
  back: { width: 56, height: 56, borderRadius: 16, borderWidth: 1, borderColor: colors.overlayWhite28Border, alignItems: 'center', justifyContent: 'center' },
  next: { flex: 1, height: 56, borderRadius: 16, backgroundColor: colors.blue, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  nextText: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
});
