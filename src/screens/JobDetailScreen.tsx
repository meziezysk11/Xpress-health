import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { EmptyView, ErrorView, LoadingView } from '../components/StateView';
import { htmlToText } from '../api/jobs';
import { useAppliedJobIds, useJobs } from '../api/queries';
import { useNavigation } from '../state/stores/navigationStore';
import { IconName } from '../theme/glyphs';
import { colors, fonts } from '../theme/theme';

export function JobDetailScreen({ jobId }: { jobId: string }) {
  const insets = useSafeAreaInsets();
  const { back, push } = useNavigation();
  const jobs = useJobs();
  const applied = useAppliedJobIds().has(jobId);
  const job = jobs.data?.find((j) => j.id === jobId);

  if (!job) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScreenHeader title="Job details" onBack={back} />
        {jobs.isPending ? (
          <LoadingView />
        ) : jobs.isError ? (
          <ErrorView message={jobs.error.message} onRetry={() => jobs.refetch()} />
        ) : (
          <EmptyView icon="work" title="Role no longer available" body="This vacancy may have been filled or closed." />
        )}
      </View>
    );
  }

  const allFacts: { icon: IconName; label: string; value: string }[] = [
    { icon: 'location_on', label: 'Location', value: job.location },
    { icon: 'work', label: 'Contract', value: job.type },
    { icon: 'payments', label: 'Salary', value: job.salary },
    { icon: 'badge', label: 'Grade/Band', value: job.grade },
    { icon: 'schedule', label: 'Hours', value: job.fullTime },
    { icon: 'apartment', label: 'Client', value: job.client },
    { icon: 'category', label: 'Specialism', value: job.specialism },
    { icon: 'sell', label: 'Payment', value: job.paymentTerms },
  ];
  const facts = allFacts.filter((f) => f.value && f.value !== '—');

  const sections = [
    { title: 'Role overview', html: job.overview },
    { title: "What you'll do", html: job.responsibilities },
    { title: "What we're looking for", html: job.requirements },
    { title: "What's on offer", html: job.benefits },
  ]
    .map((s) => ({ ...s, text: htmlToText(s.html) }))
    .filter((s) => s.text);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader
        onBack={back}
        eyebrow={job.category || 'Vacancy'}
        title={job.title}
        subtitle={`Ref: ${job.references || 'N/A'}`}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <Card radius={18} style={styles.facts}>
          {facts.map((f) => (
            <View key={f.label} style={styles.fact}>
              <View style={styles.factIcon}>
                <Icon name={f.icon} size={18} color={colors.blue} />
              </View>
              <View style={styles.factCopy}>
                <Text style={styles.factLabel}>{f.label}</Text>
                <Text style={styles.factValue}>{f.value}</Text>
              </View>
            </View>
          ))}
        </Card>

        {sections.length === 0 ? (
          <Text style={styles.noDetails}>
            Full details for this role will be shared by a consultant once you apply.
          </Text>
        ) : (
          sections.map((s) => (
            <View key={s.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionText}>{s.text}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        {applied ? (
          <Button label="You've applied for this role" icon="check_circle" variant="outline" disabled />
        ) : (
          <Button label="Apply for this role" variant="berry" onPress={() => push({ name: 'apply', jobId })} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, backgroundColor: colors.bg },
  body: { padding: 18, gap: 18, paddingBottom: 28 },
  facts: { padding: 6, flexDirection: 'row', flexWrap: 'wrap' },
  fact: { width: '50%', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  factIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.blueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factCopy: { flex: 1 },
  factLabel: {
    fontSize: 10.5,
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted2,
  },
  factValue: { fontSize: 13.5, fontFamily: fonts.semiBold, color: colors.ink },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: fonts.bold, color: colors.ink },
  sectionText: { fontSize: 14, lineHeight: 22, fontFamily: fonts.regular, color: colors.textSlate },
  noDetails: { fontSize: 13.5, lineHeight: 20, fontFamily: fonts.medium, color: colors.textMuted, textAlign: 'center' },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(13,45,94,0.07)',
  },
});
