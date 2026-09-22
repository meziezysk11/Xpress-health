import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Card } from '../components/Card';
import { DotGrid } from '../components/DotGrid';
import { HaloPulse } from '../components/HaloPulse';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { ProgressRing } from '../components/ProgressRing';
import { PulseDot } from '../components/PulseDot';
import { Sparkline } from '../components/Sparkline';
import { colors, fonts, gradient160 } from '../theme/theme';
import { useApp } from '../state/AppStateContext';
import {
  money,
  openRequests,
  ringProgress,
  sparkline,
  extraTotals,
} from '../state/derive';
import { HOURLY_RATE } from '../data/model';

export function HomeScreen() {
  const { state, dispatch } = useApp();
  const requests = openRequests(state);
  const { extraHours, extraPay } = extraTotals(state);
  const spark = sparkline(state);
  const ring = ringProgress(state);
  const hours = 36 + extraHours;

  return (
    <View style={styles.screen}>
      {/* Navy gradient header */}
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0D2D5E', '#0B2547']}
        locations={[0, 0.52, 1]}>
        <DotGrid />

        <View style={styles.profileRow}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AN</Text>
            </View>
            <View>
              <Text style={styles.profileName}>Aoife Nolan</Text>
              <Text style={styles.profileRole}>RGN · Dublin</Text>
            </View>
          </View>
          <PressableScale
            scaleTo={0.92}
            onPress={() => dispatch({ type: 'GO', screen: 'activity' })}>
            <View>
              <Icon name="notifications" size={23} color={colors.onNavyLight} />
              {requests.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{requests.length}</Text>
                </View>
              )}
            </View>
          </PressableScale>
        </View>

        <View style={styles.nextShift}>
          <Text style={styles.nextShiftLabel}>Your next shift</Text>
          <View style={styles.nextShiftBlock}>
            <Text style={styles.nextShiftPlace}>Beaumont Nursing Home</Text>
            <Text style={styles.nextShiftMeta}>
              Today · 08:00–20:00 · Ward 2B
            </Text>
            <View style={styles.nextShiftChips}>
              <View style={styles.chipSky}>
                <Text style={styles.chipSkyText}>
                  {state.clockedIn ? 'Clocked in at 07:58' : 'Starts in 2h 14m'}
                </Text>
              </View>
              <View style={styles.chipGlass}>
                <Text style={styles.chipGlassText}>
                  €{HOURLY_RATE.toFixed(2)}/hr · 11.5h
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.ctaRow}>
            <ClockInButton />
            <PressableScale style={styles.directionsBtn}>
              <Text style={styles.directionsText}>Directions</Text>
            </PressableScale>
          </View>
        </View>
      </LinearGradient>

      {/* Scroll body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Card radius={16} style={styles.statCard}>
            <Text style={styles.statLabel}>Earned this week</Text>
            <Text style={styles.statValue}>{money(486 + extraPay)}</Text>
            <Sparkline line={spark.line} area={spark.area} dot={spark.dot} />
          </Card>
          <Card radius={16} style={styles.statCard}>
            <Text style={styles.statLabel}>Hours booked</Text>
            <Text style={styles.statValue}>{hours.toFixed(1)}</Text>
            <View style={styles.ringRow}>
              <ProgressRing offset={ring.offset} />
              <Text style={styles.ringLabel}>
                {ring.label[0]}
                {'\n'}
                {ring.label[1]}
              </Text>
            </View>
          </Card>
        </View>

        <PressableScale
          onPress={() => dispatch({ type: 'GO', screen: 'timesheet' })}>
          <Card radius={18} style={styles.timesheetCard}>
            <View style={styles.timesheetIconBox}>
              <Icon name="pending_actions" size={22} color={colors.berryMid} />
            </View>
            <View style={styles.timesheetCopy}>
              <Text style={styles.timesheetTitle}>
                {state.submitted
                  ? '1 timesheet awaiting approval'
                  : '2 timesheets to submit'}
              </Text>
              <Text style={styles.timesheetSub}>
                {state.submitted
                  ? 'Sent to S. Byrne · paid Friday'
                  : 'Submit by Sunday to be paid Friday'}
              </Text>
            </View>
            <Icon name="chevron_right" size={20} color={colors.textMuted2} />
          </Card>
        </PressableScale>

        <View style={styles.requestsSection}>
          <View style={styles.requestsHeader}>
            <Text style={styles.requestsTitle}>Requests for you</Text>
            <Text style={styles.requestsCount}>{requests.length} open</Text>
          </View>

          {requests.map((req) => (
            <Card key={req.id} radius={16} style={styles.requestCard}>
              <View style={styles.requestTop}>
                <View style={styles.requestCopy}>
                  <Text style={styles.requestWhen}>{req.when}</Text>
                  <Text style={styles.requestSub}>{req.sub}</Text>
                </View>
                <View style={styles.leftPill}>
                  <PulseDot />
                  <Text style={styles.leftPillText}>{req.left}</Text>
                </View>
              </View>
              <View style={styles.requestActions}>
                <PressableScale
                  style={styles.acceptBtn}
                  onPress={() =>
                    dispatch({
                      type: 'ACCEPT',
                      id: req.id,
                      place: req.place,
                    })
                  }>
                  <Text style={styles.acceptText}>Accept</Text>
                </PressableScale>
                <PressableScale
                  style={styles.declineBtn}
                  onPress={() =>
                    dispatch({
                      type: 'DECLINE',
                      id: req.id,
                      place: req.place,
                    })
                  }>
                  <Text style={styles.declineText}>Decline</Text>
                </PressableScale>
              </View>
            </Card>
          ))}

          {requests.length === 0 && (
            <Card radius={16} style={styles.emptyCard}>
              <Icon name="inbox" size={26} color={colors.textMuted2} />
              <Text style={styles.emptyTitle}>All caught up</Text>
              <Text style={styles.emptySub}>
                New requests appear here as homes send them.
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function ClockInButton() {
  const { state, dispatch } = useApp();
  const clockedIn = state.clockedIn;

  return (
    <PressableScale
      onPress={() => dispatch({ type: 'TOGGLE_CLOCK' })}
      style={[styles.clockBtn, clockedIn ? styles.clockBtnDone : null]}>
      {!clockedIn && <HaloPulse />}
      <Text style={styles.clockBtnText}>
        {clockedIn ? 'Clock out' : 'Clock in'}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    paddingTop: 6,
    paddingHorizontal: 22,
    paddingBottom: 24,
    gap: 20,
    flexShrink: 0,
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.navy800,
  },
  profileName: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  profileRole: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted2,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  nextShift: {
    gap: 15,
  },
  nextShiftLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 1.44,
    color: colors.sky,
    textTransform: 'uppercase',
  },
  nextShiftBlock: {
    gap: 6,
  },
  nextShiftPlace: {
    fontSize: 28,
    lineHeight: 30.8,
    fontFamily: fonts.bold,
    letterSpacing: -1.064,
    color: colors.white,
  },
  nextShiftMeta: {
    fontSize: 14.5,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted,
  },
  nextShiftChips: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 9,
  },
  chipSky: {
    backgroundColor: 'rgba(65,182,229,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(65,182,229,0.4)',
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  chipSkyText: {
    fontSize: 11.5,
    fontFamily: fonts.bold,
    color: colors.skyLight,
  },
  chipGlass: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  chipGlassText: {
    fontSize: 11.5,
    fontFamily: fonts.semiBold,
    color: colors.onNavyLight,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  clockBtn: {
    flex: 1,
    backgroundColor: colors.berry,
    borderRadius: 13,
    paddingVertical: 16,
    overflow: 'visible',
    alignItems: 'center',
  },
  clockBtnDone: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  clockBtnText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  directionsBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(11,37,71,0.45)',
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: 'center',
  },
  directionsText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 22,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 0.99,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  ringLabel: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    lineHeight: 14.3,
  },
  timesheetCard: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  timesheetIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.pinkBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timesheetCopy: {
    flex: 1,
    gap: 2,
  },
  timesheetTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  timesheetSub: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  requestsSection: {
    gap: 11,
  },
  requestsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  requestsTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: -0.16,
    color: colors.ink,
  },
  requestsCount: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.blue,
  },
  requestCard: {
    padding: 14,
    gap: 10,
  },
  requestTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  requestCopy: {
    gap: 3,
  },
  requestWhen: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  requestSub: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  leftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.pinkBg,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  leftPillText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.berryDark,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 9,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  declineBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  declineText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  emptyCard: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 7,
  },
  emptyTitle: {
    fontSize: 13.5,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  emptySub: {
    fontSize: 12.5,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
