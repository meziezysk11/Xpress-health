import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { DotGrid } from '../components/DotGrid';
import { Icon } from '../components/Icon';
import { JobCard } from '../components/JobCard';
import { PressableScale } from '../components/PressableScale';
import { avatarUrl, initials } from '../api/auth';
import { useAppliedJobIds, useJobs, useMyApplications } from '../api/queries';
import { useAuthStore } from '../state/stores/authStore';
import { useNavigation } from '../state/stores/navigationStore';
import { IconName } from '../theme/glyphs';
import { colors, fonts, gradient160 } from '../theme/theme';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { go, push } = useNavigation();
  const jobs = useJobs();
  const applications = useMyApplications();
  const applied = useAppliedJobIds();

  const latest = [...(jobs.data ?? [])]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 3);

  const refreshing = jobs.isRefetching || applications.isRefetching;
  const refresh = () => {
    jobs.refetch();
    applications.refetch();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0D2D5E', '#0B2547']}
        locations={[0, 0.52, 1]}>
        <DotGrid />
        <View style={styles.profileRow}>
          <PressableScale scaleTo={0.95} onPress={() => go('profile')} style={styles.profileLeft}>
            <Avatar uri={avatarUrl(user)} initials={initials(user)} size={42} />
            <View>
              <Text style={styles.portal}>Candidate portal</Text>
              <Text style={styles.brand}>Achievers Professionals</Text>
            </View>
          </PressableScale>
        </View>
        <View style={styles.welcome}>
          <Text accessibilityRole="header" style={styles.welcomeTitle}>
            Welcome back, {user?.firstName || 'Candidate'}!
          </Text>
          <Text style={styles.welcomeSub}>
            Find your next NHS or private sector role and keep track of every application.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.blue} />}>
        <View style={styles.statsRow}>
          <StatCard
            label="Active job listings"
            value={jobs.data?.length}
            loading={jobs.isPending}
            icon="work"
            bg={colors.blue}
            onPress={() => go('jobs')}
          />
          <StatCard
            label="My applications"
            value={applications.data?.length}
            loading={applications.isPending}
            icon="description"
            bg={colors.berry}
            onPress={() => go('applications')}
          />
        </View>

        <View style={styles.actions}>
          <ActionRow
            icon="work"
            accent={colors.blue}
            title="Apply for jobs"
            body="Browse all open vacancies and find your next role"
            onPress={() => go('jobs')}
          />
          <ActionRow
            icon="description"
            accent={colors.berry}
            title="My applications"
            body="View your submitted job applications and status updates"
            onPress={() => go('applications')}
          />
          <ActionRow
            icon="person"
            accent={colors.sky}
            title="My profile"
            body="Manage your account details and password"
            onPress={() => go('profile')}
          />
        </View>

        {latest.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Latest roles</Text>
              <PressableScale scaleTo={0.95} onPress={() => go('jobs')}>
                <Text style={styles.seeAll}>See all</Text>
              </PressableScale>
            </View>
            {latest.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applied={applied.has(job.id)}
                onPress={() => push({ name: 'job', jobId: job.id })}
                onApply={() => push({ name: 'apply', jobId: job.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  loading,
  icon,
  bg,
  onPress,
}: {
  label: string;
  value?: number;
  loading: boolean;
  icon: IconName;
  bg: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${loading ? 'loading' : value ?? 0}`}
      onPress={onPress}
      style={[styles.stat, { backgroundColor: bg }]}>
      <View style={styles.statOrbA} />
      <View style={styles.statOrbB} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{loading ? '–' : value ?? 0}</Text>
      <View style={styles.statIcon}>
        <Icon name={icon} size={20} color={colors.white} />
      </View>
    </PressableScale>
  );
}

function ActionRow({
  icon,
  accent,
  title,
  body,
  onPress,
}: {
  icon: IconName;
  accent: string;
  title: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress}>
      <Card radius={16} style={styles.action}>
        <View style={[styles.actionAccent, { backgroundColor: accent }]} />
        <View style={[styles.actionIcon, { backgroundColor: `${accent}18` }]}>
          <Icon name={icon} size={22} color={accent} />
        </View>
        <View style={styles.actionCopy}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionBody}>{body}</Text>
        </View>
        <Icon name="chevron_right" size={20} color={colors.textMuted2} />
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, backgroundColor: colors.bg },
  header: { paddingTop: 18, paddingHorizontal: 22, paddingBottom: 24, gap: 20, overflow: 'hidden' },
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileLeft: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  portal: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1.4,
    color: colors.sky,
    textTransform: 'uppercase',
  },
  brand: { fontSize: 15, fontFamily: fonts.bold, color: colors.white },
  welcome: { gap: 7 },
  welcomeTitle: { fontSize: 27, lineHeight: 32, fontFamily: fonts.bold, letterSpacing: -0.9, color: colors.white },
  welcomeSub: { fontSize: 13.5, lineHeight: 19.5, fontFamily: fonts.medium, color: colors.onNavyMuted },
  scroll: { flex: 1 },
  scrollContent: { padding: 18, gap: 18, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, borderRadius: 18, padding: 16, overflow: 'hidden', minHeight: 132 },
  statOrbA: {
    position: 'absolute',
    right: -16,
    top: -16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statOrbB: {
    position: 'absolute',
    right: -24,
    bottom: -24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statLabel: {
    fontSize: 10.5,
    fontFamily: fonts.bold,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)',
  },
  statValue: { fontSize: 34, fontFamily: fonts.extraBold, color: colors.white, marginTop: 6 },
  statIcon: {
    marginTop: 'auto',
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { gap: 10 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, overflow: 'hidden' },
  actionAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  actionIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  actionCopy: { flex: 1, gap: 2 },
  actionTitle: { fontSize: 14.5, fontFamily: fonts.bold, color: colors.ink },
  actionBody: { fontSize: 12, lineHeight: 17, fontFamily: fonts.medium, color: colors.textMuted },
  section: { gap: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 17, fontFamily: fonts.bold, color: colors.ink, letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.blue },
});
