import React from 'react';
import { FlatList, Linking, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { ScreenHeader } from '../components/ScreenHeader';
import { EmptyView, ErrorView, LoadingView } from '../components/StateView';
import { applicationJobId } from '../api/jobs';
import { useJobs, useMyApplications } from '../api/queries';
import { JobApplication } from '../api/types';
import { useNavigation } from '../state/stores/navigationStore';
import { colors, fonts } from '../theme/theme';

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  pending: { bg: '#FFF4E0', fg: '#A15C00' },
  reviewed: { bg: colors.blueBg, fg: colors.blue },
  shortlisted: { bg: colors.blueBg, fg: colors.blue },
  accepted: { bg: '#E3F4EA', fg: colors.green },
  hired: { bg: '#E3F4EA', fg: colors.green },
  rejected: { bg: colors.pinkBg, fg: colors.berryMid },
};

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

export function ApplicationsScreen() {
  const insets = useSafeAreaInsets();
  const { go, push } = useNavigation();
  const applications = useMyApplications();
  const jobs = useJobs();

  const titleFor = (a: JobApplication) => {
    if (typeof a.jobPosting === 'object' && a.jobPosting?.jobName) return a.jobPosting.jobName;
    const job = jobs.data?.find((j) => j.id === applicationJobId(a));
    return job?.title ?? 'Position applied';
  };

  const sorted = [...(applications.data ?? [])].sort((a, b) =>
    (b.appliedDate || b.createdAt || '').localeCompare(a.appliedDate || a.createdAt || ''),
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader
        eyebrow="My applications"
        title="Your applications"
        subtitle="Track the status of positions you have applied for."
      />
      {applications.isPending ? (
        <LoadingView label="Loading your applications…" />
      ) : applications.isError ? (
        <ErrorView message={applications.error.message} onRetry={() => applications.refetch()} />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(a) => a._id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={applications.isRefetching}
              onRefresh={() => applications.refetch()}
              tintColor={colors.blue}
            />
          }
          ListEmptyComponent={
            <EmptyView
              icon="description"
              title="No applications yet"
              body="You haven't submitted any job applications yet. Browse open roles to get started."
              actionLabel="Browse jobs"
              onAction={() => go('jobs')}
            />
          }
          renderItem={({ item }) => {
            const status = (item.status || 'pending').toLowerCase();
            const tone = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
            const cvUrl = item.file?.url;
            const cvName = item.file?.filename || cvUrl?.substring(cvUrl.lastIndexOf('/') + 1) || 'CV';
            const jobId = applicationJobId(item);
            return (
              <PressableScale
                accessibilityRole="button"
                disabled={!jobId || !jobs.data?.some((j) => j.id === jobId)}
                onPress={() => jobId && push({ name: 'job', jobId })}>
                <Card radius={18} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.title}>{titleFor(item)}</Text>
                    <View style={[styles.status, { backgroundColor: tone.bg }]}>
                      <Text style={[styles.statusText, { color: tone.fg }]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.metaRow}>
                    <Icon name="calendar_month" size={15} color={colors.textMuted2} />
                    <Text style={styles.meta}>Applied {formatDate(item.appliedDate || item.createdAt)}</Text>
                  </View>
                  {cvUrl ? (
                    <PressableScale
                      accessibilityRole="link"
                      accessibilityLabel={`Open CV ${cvName}`}
                      onPress={() => Linking.openURL(cvUrl)}
                      style={styles.cv}>
                      <Icon name="attach_file" size={16} color={colors.blue} />
                      <Text style={styles.cvText} numberOfLines={1}>
                        {cvName}
                      </Text>
                      <Icon name="open_in_new" size={15} color={colors.blue} />
                    </PressableScale>
                  ) : (
                    <Text style={styles.meta}>No CV attached</Text>
                  )}
                </Card>
              </PressableScale>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, backgroundColor: colors.bg },
  list: { padding: 18, paddingBottom: 32, flexGrow: 1 },
  card: { padding: 16, gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  title: { flex: 1, fontSize: 16, lineHeight: 21, fontFamily: fonts.bold, color: colors.ink },
  status: { borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
  statusText: { fontSize: 11.5, fontFamily: fonts.bold },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontSize: 12.5, fontFamily: fonts.medium, color: colors.textMuted },
  cv: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: colors.blueBg,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  cvText: { fontSize: 12.5, fontFamily: fonts.bold, color: colors.blue, flexShrink: 1 },
});
