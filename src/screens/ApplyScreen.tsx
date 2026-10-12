import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { DashedBorder } from '../components/DashedBorder';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { FormDataFile } from '../api/auth';
import { useJobs, useSubmitApplication } from '../api/queries';
import { useAuthStore } from '../state/stores/authStore';
import { useNavigation } from '../state/stores/navigationStore';
import { colors, fonts } from '../theme/theme';

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

interface PickedCv {
  name: string;
  size?: number;
  file: FormDataFile;
}

export function ApplyScreen({ jobId }: { jobId: string }) {
  const insets = useSafeAreaInsets();
  const { back, go } = useNavigation();
  const user = useAuthStore((s) => s.user);
  const job = useJobs().data?.find((j) => j.id === jobId);
  const submit = useSubmitApplication();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    notes: '',
  });
  const [cv, setCv] = useState<PickedCv | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const pickCv = async () => {
    setCvError(null);
    const res = await DocumentPicker.getDocumentAsync({ type: CV_TYPES, copyToCacheDirectory: true });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (asset.size && asset.size > MAX_CV_BYTES) {
      setCvError('That file is larger than 5 MB. Please choose a smaller CV.');
      return;
    }
    setCv({
      name: asset.name,
      size: asset.size,
      // Web returns a real File; native needs the { uri, name, type } shape.
      file: asset.file ?? { uri: asset.uri, name: asset.name, type: asset.mimeType ?? 'application/octet-stream' },
    });
  };

  const valid =
    form.firstName.trim() && form.lastName.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim() && cv;

  const onSubmit = () => {
    if (!valid || !cv) return;
    submit.mutate({
      jobId,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
      cv: cv.file,
    });
  };

  if (submit.isSuccess) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ScreenHeader eyebrow="Application submitted" title="Thank you for applying!" />
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <Icon name="check_circle" size={38} color={colors.green} />
          </View>
          <Text style={styles.successText}>
            Thank you for applying for the <Text style={styles.successStrong}>{job?.title ?? 'selected'}</Text> role. A
            specialist consultant will review your CV and contact you within 1–2 working days.
          </Text>
          <Button label="View my applications" onPress={() => go('applications')} style={styles.stretch} />
          <Button label="Back to jobs" variant="outline" onPress={() => go('jobs')} style={styles.stretch} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader onBack={back} eyebrow="Applying for" title={job?.title ?? 'Job application'} subtitle={job?.location} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
        {submit.error && (
          <View style={styles.banner}>
            <Icon name="error" size={19} color={colors.red} />
            <Text style={styles.bannerText}>{submit.error.message}</Text>
          </View>
        )}
        <View style={styles.row}>
          <View style={styles.half}>
            <TextField label="First name *" value={form.firstName} onChangeText={set('firstName')} autoComplete="given-name" />
          </View>
          <View style={styles.half}>
            <TextField label="Last name *" value={form.lastName} onChangeText={set('lastName')} autoComplete="family-name" />
          </View>
        </View>
        <TextField
          label="Email address *"
          icon="mail"
          value={form.email}
          onChangeText={set('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextField
          label="Phone number *"
          icon="call"
          value={form.phone}
          onChangeText={set('phone')}
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder="+44 7700 000000"
        />

        <View style={styles.cvField}>
          <Text style={styles.label}>Upload CV (PDF, DOC, DOCX) *</Text>
          <PressableScale accessibilityRole="button" accessibilityLabel={cv ? `Change CV, ${cv.name}` : 'Upload CV'} onPress={pickCv} style={styles.cvBox}>
            <DashedBorder radius={14} color={cv ? colors.blue : colors.signBorder} />
            <Icon name={cv ? 'description' : 'upload_file'} size={28} color={colors.blue} />
            <View style={styles.cvCopy}>
              <Text style={styles.cvTitle} numberOfLines={1}>
                {cv ? cv.name : 'Tap to choose your CV'}
              </Text>
              <Text style={styles.cvSub}>
                {cv ? `${cv.size ? formatSize(cv.size) + ' · ' : ''}Tap to change` : 'Max 5 MB'}
              </Text>
            </View>
          </PressableScale>
          {cvError && <Text style={styles.cvError}>{cvError}</Text>}
        </View>

        <TextField
          label="Additional notes"
          value={form.notes}
          onChangeText={set('notes')}
          multiline
          placeholder="Any additional details or availability info…"
          style={styles.notes}
        />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Button
          label={submit.isPending ? 'Submitting application…' : 'Submit application'}
          icon="send"
          variant="berry"
          onPress={onSubmit}
          loading={submit.isPending}
          disabled={!valid}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, backgroundColor: colors.bg },
  body: { padding: 18, gap: 16, paddingBottom: 28 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.ink },
  cvField: { gap: 7 },
  cvBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  cvCopy: { flex: 1, gap: 2 },
  cvTitle: { fontSize: 14.5, fontFamily: fonts.bold, color: colors.ink },
  cvSub: { fontSize: 12, fontFamily: fonts.medium, color: colors.textMuted },
  cvError: { fontSize: 12, fontFamily: fonts.medium, color: colors.red },
  notes: { minHeight: 90, textAlignVertical: 'top' },
  banner: { flexDirection: 'row', gap: 10, backgroundColor: '#FDECEA', borderRadius: 12, padding: 12 },
  bannerText: { flex: 1, fontSize: 13, lineHeight: 18, fontFamily: fonts.semiBold, color: colors.red },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(13,45,94,0.07)',
  },
  success: { padding: 24, gap: 14, alignItems: 'center' },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: '#E3F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  successText: { fontSize: 14.5, lineHeight: 22, fontFamily: fonts.medium, color: colors.textSlate, textAlign: 'center' },
  successStrong: { fontFamily: fonts.bold, color: colors.ink },
  stretch: { alignSelf: 'stretch' },
});
