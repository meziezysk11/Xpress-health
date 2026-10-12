import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { Icon } from './Icon';
import { IconName } from '../theme/glyphs';
import { colors, fonts } from '../theme/theme';

export function LoadingView({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.blue} />
      <Text style={styles.body}>{label}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconBox, { backgroundColor: colors.pinkBg }]}>
        <Icon name="error" size={26} color={colors.berry} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.body}>{message}</Text>
      {onRetry && <Button label="Try again" icon="refresh" variant="outline" onPress={onRetry} style={styles.btn} />}
    </View>
  );
}

export function EmptyView({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: IconName;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={26} color={colors.blue} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction && <Button label={actionLabel} onPress={onAction} style={styles.btn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 28, gap: 10 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.blueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 16, fontFamily: fonts.bold, color: colors.ink, textAlign: 'center' },
  body: { fontSize: 13.5, lineHeight: 20, fontFamily: fonts.medium, color: colors.textMuted, textAlign: 'center' },
  btn: { marginTop: 8, alignSelf: 'stretch' },
});
