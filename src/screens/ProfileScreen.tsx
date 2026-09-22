import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { colors, fonts, gradient160 } from '../theme/theme';
import { useApp } from '../state/AppStateContext';

interface DocRow {
  name: string;
  status: string;
  icon: 'check_circle' | 'error' | 'schedule';
  iconColor: string;
  subColor: string;
  ok: boolean;
}

export function ProfileScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();

  const docs: DocRow[] = [
    {
      name: 'NMBI registration',
      status: 'Valid to 31 Dec 2026',
      icon: 'check_circle',
      iconColor: colors.green,
      subColor: colors.textMuted,
      ok: true,
    },
    {
      name: 'Manual handling',
      status: 'Valid to 14 Mar 2027',
      icon: 'check_circle',
      iconColor: colors.green,
      subColor: colors.textMuted,
      ok: true,
    },
    state.ohAdded
      ? {
          name: 'Occupational health',
          status: 'Uploaded — under review',
          icon: 'schedule' as const,
          iconColor: colors.blue,
          subColor: colors.blue,
          ok: true,
        }
      : {
          name: 'Occupational health',
          status: 'Missing',
          icon: 'error' as const,
          iconColor: colors.red,
          subColor: colors.red,
          ok: false,
        },
    {
      name: 'Right to work',
      status: 'Verified 2 Feb 2026',
      icon: 'check_circle',
      iconColor: colors.green,
      subColor: colors.textMuted,
      ok: true,
    },
  ];

  const okCount = docs.filter((d) => d.ok).length;
  const compliancePct = Math.round((okCount / docs.length) * 100);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0B2547']}
        locations={[0, 1]}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AN</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>Aoife Nolan</Text>
            <Text style={styles.roleText}>Staff Nurse (RGN) · NMBI 148230</Text>
          </View>
        </View>
        <View style={styles.complianceBox}>
          <View style={styles.complianceRow}>
            <Text style={styles.complianceLabel}>
              {okCount} of {docs.length} documents verified
            </Text>
            <Text style={styles.compliancePct}>{compliancePct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              style={[styles.progressFill, { width: `${compliancePct}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#015EB8', '#41B6E5']}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.docsTitleRow}>
          <Text style={styles.docsTitle}>Documents</Text>
          <Text style={styles.uploadText}>Upload</Text>
        </View>

        <View style={styles.warningBanner}>
          <Icon name="warning" size={22} color={colors.berryMid} />
          <View style={styles.warningCopy}>
            <Text style={styles.warningTitle}>
              Garda vetting expires in 12 days
            </Text>
            <Text style={styles.warningSub}>
              Renew now to keep booking shifts
            </Text>
          </View>
        </View>

        <View style={styles.docList}>
          {docs.map((doc, i) => (
            <View
              key={doc.name}
              style={[
                styles.docRow,
                i < docs.length - 1 ? styles.docRowBorder : null,
              ]}>
              <Icon name={doc.icon} size={20} color={doc.iconColor} />
              <View style={styles.docCopy}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={[styles.docStatus, { color: doc.subColor }]}>
                  {doc.status}
                </Text>
              </View>
              {!doc.ok ? (
                <PressableScale
                  onPress={() => dispatch({ type: 'ADD_OH' })}
                  style={styles.addBtn}>
                  <Text style={styles.addBtnText}>Add</Text>
                </PressableScale>
              ) : (
                <Icon name="chevron_right" size={19} color={colors.textMuted2} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.referralCard}>
          <View style={styles.referralIcon}>
            <Icon name="group_add" size={22} color={colors.white} />
          </View>
          <View style={styles.referralCopy}>
            <Text style={styles.referralTitle}>
              Refer a colleague, earn €250
            </Text>
            <Text style={styles.referralSub}>
              Paid after their first 10 shifts
            </Text>
          </View>
          <Icon name="chevron_right" size={20} color={colors.onNavyMuted} />
        </View>

        <PressableScale
          onPress={() => dispatch({ type: 'SIGN_OUT' })}
          style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign out</Text>
        </PressableScale>
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
    paddingBottom: 22,
    gap: 17,
    flexShrink: 0,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: colors.navy800,
  },
  nameBlock: {
    gap: 3,
  },
  name: {
    fontSize: 20,
    fontFamily: fonts.bold,
    letterSpacing: -0.56,
    color: colors.white,
  },
  roleText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted,
  },
  complianceBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 15,
    gap: 10,
  },
  complianceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complianceLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.onNavyLight3,
  },
  compliancePct: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.sky,
  },
  progressTrack: {
    height: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    borderRadius: 4,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    gap: 13,
  },
  docsTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  docsTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: -0.16,
    color: colors.ink,
  },
  uploadText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.blue,
  },
  warningBanner: {
    backgroundColor: colors.pinkBg,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningCopy: {
    flex: 1,
    gap: 2,
  },
  warningTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.berryDark,
  },
  warningSub: {
    fontSize: 12.5,
    fontFamily: fonts.medium,
    color: colors.berryMid,
  },
  docList: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: 'rgba(13,45,94,0.14)',
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  docRow: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  docCopy: {
    flex: 1,
    gap: 1,
  },
  docName: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.ink,
  },
  docStatus: {
    fontSize: 12.5,
    fontFamily: fonts.medium,
  },
  addBtn: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  referralCard: {
    backgroundColor: colors.navy800,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  referralIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  referralCopy: {
    flex: 1,
    gap: 2,
  },
  referralTitle: {
    fontSize: 14.5,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  referralSub: {
    fontSize: 12.5,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted,
  },
  signOutBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 13.5,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
});
