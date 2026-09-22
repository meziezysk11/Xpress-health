import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { PulseDot } from '../components/PulseDot';
import { colors, fonts, gradient160 } from '../theme/theme';
import { useApp } from '../state/AppStateContext';
import { activityLog, openRequests } from '../state/derive';

export function ActivityScreen() {
  const { state, dispatch, flash } = useApp();
  const insets = useSafeAreaInsets();
  const requests = openRequests(state);
  const log = activityLog(state);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0B2547']}
        locations={[0, 1]}>
        <View style={styles.titleRow}>
          <PressableScale
            scaleTo={0.9}
            onPress={() => dispatch({ type: 'GO', screen: 'home' })}>
            <Icon name="arrow_back" size={24} color={colors.white} />
          </PressableScale>
          <Text style={styles.title}>Activity</Text>
          <PressableScale scaleTo={0.95} onPress={() => flash('All caught up')}>
            <Text style={styles.markRead}>Mark all read</Text>
          </PressableScale>
        </View>
        <View style={styles.tabs}>
          <View style={styles.tabActive}>
            <Text style={styles.tabActiveText}>
              Requests · {requests.length}
            </Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Updates</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {requests.map((req) => (
          <Card key={req.id} radius={18} style={styles.requestCard}>
            <View style={styles.requestTop}>
              <View style={styles.requestCopy}>
                <Text style={styles.requestKind}>Shift request</Text>
                <Text style={styles.requestPlace}>{req.place}</Text>
                <Text style={styles.requestFull}>{req.full}</Text>
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
                  dispatch({ type: 'ACCEPT', id: req.id, place: req.place })
                }>
                <Text style={styles.acceptText}>Accept</Text>
              </PressableScale>
              <PressableScale
                style={styles.declineBtn}
                onPress={() =>
                  dispatch({ type: 'DECLINE', id: req.id, place: req.place })
                }>
                <Text style={styles.declineText}>Decline</Text>
              </PressableScale>
            </View>
          </Card>
        ))}

        <View style={styles.earlierSection}>
          <Text style={styles.earlierLabel}>Earlier</Text>
          {log.map((ev) => (
            <View key={ev.key} style={styles.logRow}>
              <View
                style={[styles.logIcon, { backgroundColor: ev.bg }]}>
                <Icon name={ev.icon as never} size={19} color={ev.fg} />
              </View>
              <View style={styles.logCopy}>
                <Text style={styles.logTitle}>{ev.title}</Text>
                <Text style={styles.logSub}>{ev.sub}</Text>
              </View>
            </View>
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
    paddingTop: 6,
    paddingBottom: 0,
    gap: 13,
    flexShrink: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontFamily: fonts.bold,
    letterSpacing: -0.616,
    color: colors.white,
  },
  markRead: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.sky,
  },
  tabs: {
    flexDirection: 'row',
    gap: 22,
  },
  tabActive: {
    paddingBottom: 11,
    borderBottomWidth: 3,
    borderBottomColor: colors.sky,
  },
  tabActiveText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  tab: {
    paddingBottom: 11,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.onNavyMuted2,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    gap: 12,
  },
  requestCard: {
    padding: 16,
    gap: 12,
  },
  requestTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  requestCopy: {
    flex: 1,
    gap: 4,
  },
  requestKind: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1.1,
    color: colors.blue,
    textTransform: 'uppercase',
  },
  requestPlace: {
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: -0.16,
    color: colors.ink,
  },
  requestFull: {
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
  earlierSection: {
    gap: 12,
    paddingTop: 4,
  },
  earlierLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 1.44,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  logRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  logIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logCopy: {
    gap: 2,
  },
  logTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  logSub: {
    fontSize: 12.5,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
});
