import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { TextField } from '../components/TextField';
import { FormDataFile, avatarUrl, displayName, initials, roleLabel } from '../api/auth';
import { useChangePassword, useLogout, useProfile, useUpdateProfile } from '../api/queries';
import { useAuthStore } from '../state/stores/authStore';
import { flash } from '../state/stores/toastStore';
import { colors, fonts, gradient160 } from '../theme/theme';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const profile = useProfile();
  const update = useUpdateProfile();
  const changePassword = useChangePassword();
  const logout = useLogout();

  const [details, setDetails] = useState({ firstName: '', lastName: '', phone: '' });
  const [photo, setPhoto] = useState<{ preview: string; file: FormDataFile } | null>(null);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  // Re-seed the form whenever fresh profile data arrives.
  useEffect(() => {
    if (user) setDetails({ firstName: user.firstName ?? '', lastName: user.lastName ?? '', phone: user.phone ?? '' });
  }, [profile.dataUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty =
    Boolean(photo) ||
    details.firstName !== (user?.firstName ?? '') ||
    details.lastName !== (user?.lastName ?? '') ||
    details.phone !== (user?.phone ?? '');

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (res.canceled) return;
    const a = res.assets[0];
    const name = a.fileName ?? `profile-${Date.now()}.jpg`;
    setPhoto({ preview: a.uri, file: a.file ?? { uri: a.uri, name, type: a.mimeType ?? 'image/jpeg' } });
  };

  const saveDetails = () =>
    update.mutate(
      { ...details, photo: photo?.file },
      {
        onSuccess: () => {
          setPhoto(null);
          flash('Profile updated successfully');
        },
        onError: (e) => flash(e.message || 'Failed to save profile', 'error'),
      },
    );

  const mismatch = pw.confirm.length > 0 && pw.next !== pw.confirm;
  const tooShort = pw.next.length > 0 && pw.next.length < 8;
  const savePassword = () =>
    changePassword.mutate(pw, {
      onSuccess: () => {
        setPw({ current: '', next: '', confirm: '' });
        flash('Password updated successfully');
      },
      onError: (e) => flash(e.message || 'Failed to update password', 'error'),
    });

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <LinearGradient
          style={styles.header}
          start={gradient160.start}
          end={gradient160.end}
          colors={['#123A72', '#0B2547']}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            onPress={pickPhoto}
            style={styles.avatarWrap}>
            <Avatar uri={photo?.preview ?? avatarUrl(user)} initials={initials(user)} size={84} />
            <View style={styles.cameraBadge}>
              <Icon name="photo_camera" size={16} color={colors.white} />
            </View>
          </Pressable>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{displayName(user)}</Text>
            <Text style={styles.role}>{roleLabel(user).toUpperCase()}</Text>
            {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
          </View>
          {photo && <Text style={styles.photoHint}>New photo will be saved with your changes</Text>}
        </LinearGradient>

        <View style={styles.body}>
          <Card radius={18} style={styles.card}>
            <Text style={styles.cardTitle}>Personal information</Text>
            <View style={styles.row}>
              <View style={styles.half}>
                <TextField
                  label="First name"
                  value={details.firstName}
                  onChangeText={(v) => setDetails((d) => ({ ...d, firstName: v }))}
                />
              </View>
              <View style={styles.half}>
                <TextField
                  label="Last name"
                  value={details.lastName}
                  onChangeText={(v) => setDetails((d) => ({ ...d, lastName: v }))}
                />
              </View>
            </View>
            <TextField label="Email address" icon="mail" value={user?.email ?? ''} disabled />
            <TextField
              label="Phone"
              icon="call"
              value={details.phone}
              onChangeText={(v) => setDetails((d) => ({ ...d, phone: v }))}
              keyboardType="phone-pad"
              placeholder="+44 7700 000000"
            />
            <Button label="Save changes" onPress={saveDetails} loading={update.isPending} disabled={!dirty} />
          </Card>

          <Card radius={18} style={styles.card}>
            <Text style={styles.cardTitle}>Change password</Text>
            <TextField
              label="Current password"
              icon="lock"
              password
              value={pw.current}
              onChangeText={(v) => setPw((p) => ({ ...p, current: v }))}
              autoCapitalize="none"
              textContentType="password"
            />
            <TextField
              label="New password"
              icon="key"
              password
              value={pw.next}
              onChangeText={(v) => setPw((p) => ({ ...p, next: v }))}
              autoCapitalize="none"
              textContentType="newPassword"
              error={tooShort ? 'Use at least 8 characters.' : null}
            />
            <TextField
              label="Confirm new password"
              icon="key"
              password
              value={pw.confirm}
              onChangeText={(v) => setPw((p) => ({ ...p, confirm: v }))}
              autoCapitalize="none"
              textContentType="newPassword"
              error={mismatch ? 'Passwords do not match.' : null}
            />
            <Button
              label="Update password"
              variant="outline"
              onPress={savePassword}
              loading={changePassword.isPending}
              disabled={!pw.current || pw.next.length < 8 || pw.next !== pw.confirm}
            />
          </Card>

          <Button
            label="Sign out"
            icon="logout"
            variant="outline"
            onPress={() => logout.mutate()}
            loading={logout.isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, backgroundColor: colors.bg },
  scroll: { paddingBottom: 32 },
  header: { alignItems: 'center', paddingTop: 28, paddingBottom: 28, paddingHorizontal: 22, gap: 14 },
  avatarWrap: { borderRadius: 46, borderWidth: 3, borderColor: 'rgba(255,255,255,0.25)' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.navy900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBlock: { alignItems: 'center', gap: 3 },
  name: { fontSize: 22, fontFamily: fonts.bold, color: colors.white, letterSpacing: -0.5 },
  role: { fontSize: 11, fontFamily: fonts.bold, letterSpacing: 1.6, color: colors.sky },
  email: { fontSize: 13, fontFamily: fonts.medium, color: colors.onNavyMuted },
  photoHint: { fontSize: 12, fontFamily: fonts.medium, color: colors.skyLight },
  body: { padding: 18, gap: 16 },
  card: { padding: 18, gap: 14 },
  cardTitle: { fontSize: 16, fontFamily: fonts.bold, color: colors.ink },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
