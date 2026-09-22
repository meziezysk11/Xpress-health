import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { colors, fonts, gradient160 } from '../theme/theme';
import { useApp } from '../state/AppStateContext';
import { currentDetail, money } from '../state/derive';

const CREW = [
  { initials: 'SB', name: 'S. Byrne', role: 'Manager' },
  { initials: 'MK', name: 'Dr Kelly', role: 'GP' },
  { initials: 'JO', name: 'J. Okafor', role: 'HCA' },
];

export function ShiftDetailScreen() {
  const { state, dispatch } = useApp();
  const detail = currentDetail(state);
  const booked = state.booked.includes(detail.id);
  const total = detail.rate * detail.hours;

  return (
    <View style={styles.screen}>
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0B2547']}
        locations={[0, 1]}>
        <View style={styles.navRow}>
          <PressableScale
            scaleTo={0.9}
            onPress={() => dispatch({ type: 'GO', screen: 'shifts' })}>
            <Icon name="arrow_back" size={24} color={colors.white} />
          </PressableScale>
          <View style={styles.navActions}>
            <Icon name="bookmark_border" size={23} color={colors.onNavyLight} />
            <Icon name="share" size={23} color={colors.onNavyLight} />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.role}>{detail.role}</Text>
          <Text style={styles.place}>{detail.place}</Text>
          <View style={styles.addressRow}>
            <Icon name="location_on" size={17} color={colors.onNavyMuted} />
            <Text style={styles.address}>{detail.address}</Text>
          </View>
        </View>

        <View style={styles.factsBox}>
          <View style={styles.fact}>
            <Text style={styles.factLabel}>Rate</Text>
            <Text style={styles.factValue}>{money(detail.rate)}</Text>
          </View>
          <View style={styles.factDivider} />
          <View style={styles.fact}>
            <Text style={styles.factLabel}>Hours</Text>
            <Text style={styles.factValue}>{detail.hours.toFixed(1)}</Text>
          </View>
          <View style={styles.factDivider} />
          <View style={styles.fact}>
            <Text style={[styles.factLabel, styles.factLabelSky]}>Est. total</Text>
            <Text style={styles.factValue}>{money(total)}</Text>
          </View>
        </View>

        <View style={styles.trustRow}>
          <Icon name="verified_user" size={15} color={colors.sky} />
          <Text style={styles.trustText}>
            Instant confirm · free cancel 48h · consultant Sinéad Byrne
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift details</Text>
          <View style={styles.detailRow}>
            <Icon name="event" size={20} color={colors.blue} />
            <Text style={styles.detailText}>{detail.dateLine}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="bed" size={20} color={colors.blue} />
            <Text style={styles.detailText}>{detail.ward}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="restaurant" size={20} color={colors.blue} />
            <Text style={styles.detailText}>
              Unpaid 30 min break · parking on site
            </Text>
          </View>
        </View>

        <View style={styles.rule} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required to attend</Text>
          <View style={styles.reqs}>
            <View style={styles.reqBlue}>
              <Icon name="check_circle" size={15} color={colors.blueDeep} />
              <Text style={styles.reqBlueText}>NMBI pin</Text>
            </View>
            <View style={styles.reqBlue}>
              <Icon name="check_circle" size={15} color={colors.blueDeep} />
              <Text style={styles.reqBlueText}>Manual handling</Text>
            </View>
            <View style={styles.reqPink}>
              <Icon name="error" size={15} color={colors.berryDark} />
              <Text style={styles.reqPinkText}>Garda vetting expires soon</Text>
            </View>
          </View>
        </View>

        <View style={styles.rule} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who you'll work with</Text>
          <View style={styles.crew}>
            {CREW.map((member) => (
              <View key={member.initials} style={styles.crewMember}>
                <View style={styles.crewAvatar}>
                  <Text style={styles.crewAvatarText}>
                    {member.initials}
                  </Text>
                </View>
                <View>
                  <Text style={styles.crewName}>{member.name}</Text>
                  <Text style={styles.crewRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.earnLabel}>You'll earn</Text>
            <Text style={styles.earnValue}>{money(total)}</Text>
          </View>
          <PressableScale
            onPress={() => {
              if (booked) {
                dispatch({ type: 'GO', screen: 'schedule' });
              } else {
                dispatch({
                  type: 'BOOK',
                  id: detail.id,
                  place: detail.place,
                  amount: total,
                });
              }
            }}
            style={booked ? styles.bookBtnDone : styles.bookBtn}>
            <Text
              style={
                booked ? styles.bookBtnDoneText : styles.bookBtnText
              }>
              {booked ? 'Booked · view schedule' : 'Book this shift'}
            </Text>
          </PressableScale>
        </View>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 22,
    gap: 18,
    flexShrink: 0,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navActions: {
    flexDirection: 'row',
    gap: 16,
    color: colors.onNavyLight,
  },
  titleBlock: {
    gap: 9,
  },
  role: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1.32,
    color: colors.sky,
    textTransform: 'uppercase',
  },
  place: {
    fontSize: 27,
    lineHeight: 31,
    fontFamily: fonts.bold,
    letterSpacing: -0.945,
    color: colors.white,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  address: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted,
  },
  factsBox: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 17,
  },
  fact: {
    gap: 3,
  },
  factLabel: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    letterSpacing: 0.88,
    color: colors.onNavyMuted,
    textTransform: 'uppercase',
  },
  factLabelSky: {
    color: colors.sky,
  },
  factValue: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.white,
    fontVariant: ['tabular-nums'],
  },
  factDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted,
    lineHeight: 15.6,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    gap: 14,
  },
  section: {
    gap: 11,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: -0.16,
    color: colors.ink,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.ink,
  },
  rule: {
    height: 1,
    backgroundColor: colors.border,
  },
  reqs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reqBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.blueBg,
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  reqBlueText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.blueDeep,
  },
  reqPink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.pinkBg,
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  reqPinkText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.berryDark,
  },
  crew: {
    flexDirection: 'row',
    gap: 8,
  },
  crewMember: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  crewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.blueBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  crewAvatarText: {
    fontSize: 11.5,
    fontFamily: fonts.bold,
    color: colors.blueDeep,
  },
  crewName: {
    fontSize: 11.5,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  crewRole: {
    fontSize: 10.5,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 12,
    flexShrink: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(13,45,94,0.07)',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  earnLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 0.99,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  earnValue: {
    fontSize: 21,
    fontFamily: fonts.extraBold,
    color: colors.berry,
    fontVariant: ['tabular-nums'],
  },
  bookBtn: {
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 16,
  },
  bookBtnText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
  bookBtnDone: {
    flex: 1,
    backgroundColor: colors.blueBg,
    borderRadius: 14,
    paddingVertical: 16,
  },
  bookBtnDoneText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.blueDeep,
    textAlign: 'center',
  },
  homeIndicator: {
    height: 5,
    width: 126,
    borderRadius: 3,
    backgroundColor: colors.indicator,
    alignSelf: 'center',
  },
});
