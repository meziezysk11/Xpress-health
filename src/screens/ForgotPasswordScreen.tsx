import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { useForgotPassword, useResendOtp, useResetPassword } from '../api/queries';
import { colors, fonts } from '../theme/theme';

type Step = 'email' | 'reset' | 'done';

/** Request code → enter code + new password → back to sign in. */
export function ForgotPasswordScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const forgot = useForgotPassword();
  const resend = useResendOtp();
  const reset = useResetPassword();

  const mismatch = confirm.length > 0 && password !== confirm;
  const tooShort = password.length > 0 && password.length < 8;
  const error = forgot.error?.message ?? resend.error?.message ?? reset.error?.message;

  const sendCode = () =>
    forgot.mutate(email.trim(), {
      onSuccess: (res) => {
        setNotice(res?.message || `We've sent a reset code to ${email.trim()}.`);
        setStep('reset');
      },
    });

  const submitReset = () =>
    reset.mutate({ email: email.trim(), otp: otp.trim(), password }, { onSuccess: () => setStep('done') });

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader
        onBack={onDone}
        eyebrow="Account recovery"
        title={step === 'done' ? 'Password updated' : 'Reset your password'}
        subtitle={
          step === 'email'
            ? "Enter the email you use to sign in and we'll send you a reset code."
            : step === 'reset'
              ? 'Enter the code from your email and choose a new password.'
              : 'You can now sign in with your new password.'
        }
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {error && step !== 'done' && (
          <View style={styles.banner}>
            <Icon name="error" size={19} color={colors.red} />
            <Text style={[styles.bannerText, { color: colors.red }]}>{error}</Text>
          </View>
        )}
        {notice && step === 'reset' && !error && (
          <View style={[styles.banner, { backgroundColor: colors.blueBg }]}>
            <Icon name="mail" size={19} color={colors.blue} />
            <Text style={[styles.bannerText, { color: colors.blue }]}>{notice}</Text>
          </View>
        )}

        {step === 'email' && (
          <>
            <TextField
              label="Email address"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              placeholder="you@example.com"
              returnKeyType="send"
              onSubmitEditing={sendCode}
            />
            <Button label="Send reset code" onPress={sendCode} loading={forgot.isPending} disabled={!email.trim()} />
          </>
        )}

        {step === 'reset' && (
          <>
            <TextField
              label="Reset code"
              icon="key"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              placeholder="Code from your email"
            />
            <TextField
              label="New password"
              icon="lock"
              password
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              textContentType="newPassword"
              error={tooShort ? 'Use at least 8 characters.' : null}
            />
            <TextField
              label="Confirm new password"
              icon="lock"
              password
              value={confirm}
              onChangeText={setConfirm}
              autoCapitalize="none"
              textContentType="newPassword"
              error={mismatch ? 'Passwords do not match.' : null}
            />
            <Button
              label="Reset password"
              onPress={submitReset}
              loading={reset.isPending}
              disabled={!otp.trim() || password.length < 8 || password !== confirm}
            />
            <Button
              label="Resend code"
              variant="ghost"
              loading={resend.isPending}
              onPress={() =>
                resend.mutate(email.trim(), { onSuccess: () => setNotice('A new code is on its way.') })
              }
            />
          </>
        )}

        {step === 'done' && (
          <>
            <View style={styles.doneIcon}>
              <Icon name="check_circle" size={34} color={colors.green} />
            </View>
            <Button label="Back to sign in" onPress={onDone} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 22, gap: 16 },
  banner: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    padding: 12,
  },
  bannerText: { flex: 1, fontSize: 13, lineHeight: 18, fontFamily: fonts.semiBold },
  doneIcon: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#E3F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});
