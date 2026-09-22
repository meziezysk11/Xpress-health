import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { colors, fonts, gradient160 } from '../theme/theme';
import { useApp } from '../state/AppStateContext';
import { upcomingEntries } from '../state/derive';

interface DayCell {
  day: number;
  variant: 'plain' | 'today' | 'booked' | 'flagged';
}

const WEEK_HEADER = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function dayCell(day: number, booked30: boolean): DayCell {
  if (day === 26) return { day, variant: 'today' };
  if (day === 27 || day === 29) return { day, variant: 'booked' };
  if (day === 30) return { day, variant: booked30 ? 'booked' : 'flagged' };
  return { day, variant: 'plain' };
}

export function ScheduleScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();
  const upcoming = upcomingEntries(state);
  const booked30 =
    state.accepted.includes('r1') || state.booked.includes('clontarf');
  const days: DayCell[] = [];
  for (let d = 24; d <= 30; d++) days.push(dayCell(d, booked30));

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0B2547']}
        locations={[0, 1]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>August 2026</Text>
          <View style={styles.monthNav}>
            <Icon name="chevron_left" size={22} color={colors.onNavyMuted} />
            <Icon name="chevron_right" size={22} color={colors.onNavyMuted} />
          </View>
        </View>

        <View style={styles.grid}>
          {WEEK_HEADER.map((d, i) => (
            <Text key={`h${i}`} style={styles.weekHeader}>
              {d}
            </Text>
          ))}
          {days.map((cell) => (
            <View
              key={cell.day}
              style={[
                styles.dayCell,
                cell.variant === 'today' ? styles.cellToday : null,
                cell.variant === 'booked' ? styles.cellBooked : null,
                cell.variant === 'flagged' ? styles.cellFlagged : null,
              ]}>
              <Text
                style={[
                  styles.dayText,
                  cell.variant === 'today' ? styles.dayTextToday : null,
                  cell.variant === 'booked' || cell.variant === 'flagged'
                    ? styles.dayTextBooked
                    : null,
                ]}>
                {cell.day}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Today</Text>
          <View style={styles.todayCard}>
            <View style={styles.todayTop}>
              <View style={styles.todayCopy}>
                <Text style={styles.todayPlace}>Beaumont Nursing Home</Text>
                <Text style={styles.todayMeta}>08:00–20:00 · Ward 2B</Text>
              </View>
              <View
                style={
                  state.clockedIn
                    ? styles.todayBadgeProgress
                    : styles.todayBadge
                }>
                {state.clockedIn && (
                  <Text style={styles.todayBadgeProgressText}>
                    In progress
                  </Text>
                )}
                {!state.clockedIn && (
                  <Text style={styles.todayBadgeText}>Starts 08:00</Text>
                )}
              </View>
            </View>
            <PressableScale
              onPress={() => dispatch({ type: 'TOGGLE_CLOCK' })}
              style={styles.clockBtn}>
              <Text style={styles.clockBtnText}>
                {state.clockedIn ? 'Clock out' : 'Clock in'}
              </Text>
            </PressableScale>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Upcoming</Text>
          {upcoming.map((up) => (
            <Card
              key={up.key}
              radius={16}
              style={[
                styles.upCard,
                up.variant === 'booked' ? styles.upCardBooked : undefined,
              ]}
              ringColor={
                up.variant === 'booked'
                  ? 'rgba(1,94,184,0.16)'
                  : 'rgba(13,45,94,0.06)'
              }>
              <View style={styles.upDate}>
                <Text
                  style={[
                    styles.upDow,
                    up.variant === 'booked' ? styles.upDowBooked : null,
                  ]}>
                  {up.dow}
                </Text>
                <Text
                  style={[
                    styles.upDay,
                    up.variant === 'booked' ? styles.upDayBooked : null,
                  ]}>
                  {up.day}
                </Text>
              </View>
              <View
                style={[
                  styles.upCopy,
                  {
                    borderLeftColor:
                      up.variant === 'booked' ? colors.blueBorder : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.upPlace,
                    up.variant === 'booked' ? styles.upPlaceBooked : null,
                  ]}>
                  {up.place}
                </Text>
                <Text
                  style={[
                    styles.upSub,
                    up.variant === 'booked' ? styles.upSubBooked : null,
                  ]}>
                  {up.sub}
                </Text>
              </View>
              <Icon name="chevron_right" size={20} color={colors.textMuted2} />
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
    gap: 16,
    flexShrink: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    letterSpacing: -0.616,
    color: colors.white,
  },
  monthNav: {
    flexDirection: 'row',
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  weekHeader: {
    width: '13.5%',
    textAlign: 'center',
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.onNavyMuted2,
  },
  dayCell: {
    width: '13.5%',
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 11,
  },
  cellToday: {
    backgroundColor: colors.sky,
  },
  cellBooked: {
    backgroundColor: colors.blue,
  },
  cellFlagged: {
    backgroundColor: colors.berry,
  },
  dayText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.onNavyLight,
  },
  dayTextToday: {
    fontFamily: fonts.bold,
    color: colors.navy800,
  },
  dayTextBooked: {
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    gap: 15,
  },
  section: {
    gap: 11,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 1.44,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  todayCard: {
    backgroundColor: colors.blue,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  todayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  todayCopy: {
    flex: 1,
    gap: 4,
  },
  todayPlace: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  todayMeta: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.onNavyLight2,
  },
  todayBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 9,
    alignSelf: 'flex-start',
  },
  todayBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  todayBadgeProgress: {
    backgroundColor: colors.berry,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 9,
    alignSelf: 'flex-start',
  },
  todayBadgeProgressText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  clockBtn: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  clockBtnText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  upCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 15,
  },
  upCardBooked: {
    backgroundColor: colors.blueBg,
  },
  upDate: {
    width: 46,
    alignItems: 'center',
    flexShrink: 0,
  },
  upDow: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  upDowBooked: {
    color: colors.blueDeep,
  },
  upDay: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  upDayBooked: {
    color: colors.blueDeep,
  },
  upCopy: {
    flex: 1,
    borderLeftWidth: 1,
    paddingLeft: 13,
    gap: 3,
  },
  upPlace: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  upPlaceBooked: {
    color: colors.blueDeep,
  },
  upSub: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  upSubBooked: {
    color: colors.blue,
  },
});
