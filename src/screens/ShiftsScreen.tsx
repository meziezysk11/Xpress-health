import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { colors, fonts, gradient160 } from '../theme/theme';
import { useApp } from '../state/AppStateContext';
import { visibleShifts } from '../state/derive';
import { Filters } from '../data/model';

export function ShiftsScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();
  const visible = visibleShifts(state);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0B2547']}
        locations={[0, 1]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Find shifts</Text>
          <Text style={styles.savedSearches}>Saved searches</Text>
        </View>

        <View style={styles.searchBox}>
          <Icon name="search" size={19} color={colors.onNavyMuted} />
          <Text style={styles.searchText}>Dublin</Text>
        </View>

        <View style={styles.chips}>
          <Chip
            label="€25+/hr"
            active={state.filters.rate}
            onPress={() =>
              dispatch({ type: 'TOGGLE_FILTER', key: 'rate' as keyof Filters })
            }
          />
          <Chip
            label="Within 10 km"
            active={state.filters.near}
            onPress={() =>
              dispatch({ type: 'TOGGLE_FILTER', key: 'near' as keyof Filters })
            }
          />
          <Chip
            label="Days only"
            active={state.filters.days}
            onPress={() =>
              dispatch({ type: 'TOGGLE_FILTER', key: 'days' as keyof Filters })
            }
          />
        </View>
      </LinearGradient>

      <View style={styles.resultBar}>
        <Text style={styles.resultCount}>
          {visible.length === 1 ? '1 shift' : `${visible.length} shifts`}
        </Text>
        <View style={styles.sortRow}>
          <Text style={styles.sortText}>Highest rate</Text>
          <Icon name="expand_more" size={16} color={colors.blue} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {visible.map((shift) => {
          const booked = state.booked.includes(shift.id);
          return (
            <PressableScale
              key={shift.id}
              onPress={() =>
                dispatch({ type: 'OPEN_DETAIL', id: shift.id })
              }>
              <Card radius={18} style={styles.shiftCard}>
                <View style={styles.shiftTop}>
                  <View style={styles.shiftCopy}>
                    <Text style={styles.shiftRole}>{shift.role}</Text>
                    <Text style={styles.shiftPlace}>{shift.place}</Text>
                    <Text style={styles.shiftMeta}>
                      {shift.when} · {shift.km} km
                    </Text>
                  </View>
                  <View style={styles.shiftRate}>
                    <Text style={styles.rateValue}>€{shift.rate}</Text>
                    <Text style={styles.rateUnit}>per hour</Text>
                  </View>
                </View>
                <View style={styles.shiftBottom}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{shift.tag}</Text>
                  </View>
                  <Text
                    style={[
                      styles.cta,
                      booked ? styles.ctaBooked : null,
                    ]}>
                    {booked ? 'Booked' : 'Book'}
                  </Text>
                </View>
              </Card>
            </PressableScale>
          );
        })}

        {visible.length === 0 && (
          <Card radius={18} style={styles.emptyCard}>
            <Icon name="filter_alt_off" size={28} color={colors.textMuted2} />
            <Text style={styles.emptyTitle}>No shifts match those filters</Text>
            <Text style={styles.emptySub}>
              Loosen a filter above to see more of the 24 shifts near you.
            </Text>
            <PressableScale
              onPress={() => dispatch({ type: 'CLEAR_FILTERS' })}
              style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear filters</Text>
            </PressableScale>
          </Card>
        )}
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
    gap: 15,
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
  savedSearches: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.sky,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultBar: {
    backgroundColor: colors.white,
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(13,45,94,0.07)',
  },
  resultCount: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sortText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.blue,
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
  shiftCard: {
    padding: 15,
    gap: 10,
  },
  shiftTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  shiftCopy: {
    flex: 1,
    gap: 4,
  },
  shiftRole: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1.1,
    color: colors.blue,
    textTransform: 'uppercase',
  },
  shiftPlace: {
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: -0.16,
    color: colors.ink,
  },
  shiftMeta: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  shiftRate: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.berry,
    fontVariant: ['tabular-nums'],
  },
  rateUnit: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  shiftBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.blueBg,
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  tagText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.blueDeep,
  },
  cta: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.blue,
    borderWidth: 1.5,
    borderColor: colors.blue,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  ctaBooked: {
    color: colors.textMuted,
    borderColor: colors.border,
  },
  emptyCard: {
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14.5,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  emptySub: {
    fontSize: 12.5,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18.1,
  },
  clearBtn: {
    marginTop: 4,
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
