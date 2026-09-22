import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from './PressableScale';
import { colors, fonts } from '../theme/theme';
import { ICON_GLYPHS } from '../theme/glyphs';
import { ScreenName } from '../data/model';
import { useApp } from '../state/AppStateContext';

const TABS: { name: ScreenName; icon: 'home' | 'search' | 'calendar_month' | 'receipt_long' | 'person'; label: string }[] = [
  { name: 'home', icon: 'home', label: 'Home' },
  { name: 'shifts', icon: 'search', label: 'Shifts' },
  { name: 'schedule', icon: 'calendar_month', label: 'Schedule' },
  { name: 'timesheet', icon: 'receipt_long', label: 'Timesheets' },
  { name: 'profile', icon: 'person', label: 'Profile' },
];

function Tab({ tab, active }: { tab: (typeof TABS)[number]; active: boolean }) {
  const { dispatch } = useApp();
  const progress = useSharedValue(active ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const colorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.textMuted2, colors.blue]),
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.05 * progress.value }],
  }));

  return (
    <PressableScale
      scaleTo={0.94}
      onPress={() => dispatch({ type: 'GO', screen: tab.name })}
      style={styles.tab}>
      <Animated.View style={scaleStyle}>
        <Animated.Text style={[styles.icon, colorStyle]}>
          {ICON_GLYPHS[tab.icon]}
        </Animated.Text>
      </Animated.View>
      <Animated.Text style={[styles.label, colorStyle]}>
        {tab.label}
      </Animated.Text>
    </PressableScale>
  );
}

export function TabBar({ active }: { active: ScreenName }) {
  return (
    <View style={styles.bar}>
      <View style={styles.row}>
        {TABS.map((tab) => (
          <Tab key={tab.name} tab={tab} active={tab.name === active} />
        ))}
      </View>
      <View style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(13,45,94,0.07)',
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  icon: {
    fontFamily: fonts.symbols,
    fontSize: 24,
    lineHeight: 24,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
    fontFamily: fonts.semiBold,
  },
  indicator: {
    height: 5,
    width: 126,
    borderRadius: 3,
    backgroundColor: colors.indicator,
    marginTop: 11,
    alignSelf: 'center',
  },
});
