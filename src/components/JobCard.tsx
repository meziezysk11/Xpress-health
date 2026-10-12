import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { Job } from '../api/types';
import { IconName } from '../theme/glyphs';
import { colors, fonts } from '../theme/theme';

interface JobCardProps {
  job: Job;
  applied: boolean;
  onPress: () => void;
  onApply: () => void;
}

export function JobCard({ job, applied, onPress, onApply }: JobCardProps) {
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={`${job.title}, ${job.location}`} onPress={onPress}>
      <Card radius={18} style={styles.card}>
        {job.location ? (
          <View style={styles.locationRow}>
            <Icon name="location_on" size={15} color={colors.blue} />
            <Text style={styles.location}>{job.location}</Text>
          </View>
        ) : null}
        <Text style={styles.title}>{job.title}</Text>
        <View style={styles.meta}>
          <Meta icon="category" text={job.specialism || 'General'} />
          <Meta icon="payments" text={job.salary} />
          {job.type ? <Meta icon="work" text={job.type} /> : null}
        </View>
        <View style={styles.footer}>
          {job.category ? (
            <View style={styles.categoryPill}>
              <View style={styles.dot} />
              <Text style={styles.category} numberOfLines={1}>
                {job.category}
              </Text>
            </View>
          ) : (
            <View />
          )}
          {applied ? (
            <View style={styles.appliedPill}>
              <Icon name="check" size={15} color={colors.green} />
              <Text style={styles.appliedText}>Applied</Text>
            </View>
          ) : (
            <PressableScale accessibilityRole="button" accessibilityLabel={`Apply for ${job.title}`} onPress={onApply} style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
              <Icon name="arrow_forward" size={16} color={colors.white} />
            </PressableScale>
          )}
        </View>
      </Card>
    </PressableScale>
  );
}

function Meta({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Icon name={icon} size={15} color={colors.textMuted2} />
      <Text style={styles.metaText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: 12, fontFamily: fonts.semiBold, color: colors.blue },
  title: { fontSize: 17, lineHeight: 22, fontFamily: fonts.bold, color: colors.ink, letterSpacing: -0.3 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5, maxWidth: '100%' },
  metaText: { fontSize: 12.5, fontFamily: fonts.medium, color: colors.textSlate, flexShrink: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
    marginTop: 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blueBg,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexShrink: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.blue },
  category: { fontSize: 11.5, fontFamily: fonts.semiBold, color: colors.blue, flexShrink: 1 },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.berry,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  applyText: { fontSize: 13, fontFamily: fonts.bold, color: colors.white },
  appliedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E3F4EA',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  appliedText: { fontSize: 13, fontFamily: fonts.bold, color: colors.green },
});
