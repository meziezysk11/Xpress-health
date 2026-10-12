import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from './Icon';
import { colors, fonts, gradient160 } from '../theme/theme';

interface ScreenHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  children?: ReactNode;
}

/** Navy gradient header shared by every signed-in screen. */
export function ScreenHeader({ title, eyebrow, subtitle, onBack, right, children }: ScreenHeaderProps) {
  return (
    <LinearGradient
      style={styles.header}
      start={gradient160.start}
      end={gradient160.end}
      colors={['#123A72', '#0D2D5E', '#0B2547']}
      locations={[0, 0.52, 1]}>
      {(onBack || right) && (
        <View style={styles.topRow}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={8}
              onPress={onBack}
              style={styles.back}>
              <Icon name="arrow_back" size={22} color={colors.white} />
            </Pressable>
          ) : (
            <View />
          )}
          {right}
        </View>
      )}
      <View style={styles.titles}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 22, gap: 16, overflow: 'hidden' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.overlayWhite16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: { gap: 6 },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1.6,
    color: colors.sky,
    textTransform: 'uppercase',
  },
  title: { fontSize: 26, lineHeight: 31, fontFamily: fonts.bold, letterSpacing: -0.8, color: colors.white },
  subtitle: { fontSize: 13.5, lineHeight: 19.5, fontFamily: fonts.medium, color: colors.onNavyMuted },
});
