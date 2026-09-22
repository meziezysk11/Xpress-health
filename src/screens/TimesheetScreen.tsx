import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../components/Card';
import { DashedBorder } from '../components/DashedBorder';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { colors, fonts, gradient160 } from '../theme/theme';
import { useApp } from '../state/AppStateContext';
import { money, payableHours } from '../state/derive';

export function TimesheetScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();
  const payable = payableHours(state.breakMin);
  const payTotal = payable * 29;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <LinearGradient
        style={styles.header}
        start={gradient160.start}
        end={gradient160.end}
        colors={['#123A72', '#0B2547']}
        locations={[0, 1]}>
        <PressableScale
          scaleTo={0.9}
          onPress={() => dispatch({ type: 'GO', screen: 'home' })}>
          <Icon name="arrow_back" size={24} color={colors.white} />
        </PressableScale>
        <View>
          <Text style={styles.title}>Submit timesheet</Text>
          <Text style={styles.subtitle}>Beaumont · Mon 24 Aug</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {state.submitted && (
          <View style={styles.submittedBox}>
            <Icon name="task_alt" size={30} color={colors.blue} />
            <Text style={styles.submittedTitle}>Timesheet submitted</Text>
            <Text style={styles.submittedSub}>
              Sent to S. Byrne for approval. {money(payTotal)} lands Friday 4
              Sep.
            </Text>
          </View>
        )}

        <Card radius={20} style={styles.sheetCard}>
          <View style={styles.clockRow}>
            <View style={styles.clockCol}>
              <Text style={styles.clockLabel}>Clocked in</Text>
              <Text style={styles.clockValue}>07:58</Text>
            </View>
            <Icon name="arrow_forward" size={22} color={colors.textMuted2} />
            <View style={[styles.clockCol, styles.clockColRight]}>
              <Text style={styles.clockLabel}>Clocked out</Text>
              <Text style={styles.clockValue}>20:06</Text>
            </View>
          </View>

          <View style={styles.innerRule} />

          <View style={styles.breakRow}>
            <Text style={styles.breakLabel}>Unpaid break</Text>
            <View style={styles.stepper}>
              <PressableScale
                scaleTo={0.9}
                onPress={() => dispatch({ type: 'BREAK_DELTA', delta: -15 })}>
                <View style={styles.stepDown}>
                  <Icon name="remove" size={17} color={colors.textMuted} />
                </View>
              </PressableScale>
              <Text style={styles.breakValue}>{state.breakMin} min</Text>
              <PressableScale
                scaleTo={0.9}
                onPress={() => dispatch({ type: 'BREAK_DELTA', delta: 15 })}>
                <View style={styles.stepUp}>
                  <Icon name="add" size={17} color={colors.blue} />
                </View>
              </PressableScale>
            </View>
          </View>

          <View style={styles.payBox}>
            <View style={styles.payRow}>
              <Text style={styles.payRowLabel}>
                Payable hours · {payable.toFixed(2)} @ €29.00
              </Text>
              <Text style={styles.payRowValue}>{money(payTotal)}</Text>
            </View>
            <View style={styles.payRow}>
              <Text style={styles.payRowLabel}>Unsocial hours uplift</Text>
              <Text style={styles.payRowValue}>€0.00</Text>
            </View>
            <View style={styles.payBoxRule} />
            <View style={styles.payRow}>
              <Text style={styles.payTotalLabel}>Est. gross pay</Text>
              <Text style={styles.payTotalValue}>{money(payTotal)}</Text>
            </View>
            <Text style={styles.payNote}>
              Ref TS-24081 · paid Friday 4 Sep
            </Text>
          </View>
        </Card>

        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Notes for the ward manager</Text>
          <View style={styles.notesBox}>
            <Text style={styles.notesPlaceholder}>
              Optional — handover notes, overtime reason…
            </Text>
          </View>
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Manager signature</Text>
          <PressableScale
            scaleTo={0.98}
            onPress={() => dispatch({ type: 'SIGN_SHEET' })}>
            <View
              style={[
                styles.signBox,
                state.signed ? { borderColor: colors.blue } : null,
              ]}>
              <DashedBorder
                color={state.signed ? colors.blue : colors.signBorder}
              />
              <Icon
                name={state.signed ? 'check_circle' : 'draw'}
                size={24}
                color={colors.blue}
              />
              <Text style={styles.signLabel}>
                {state.signed ? 'Signed by S. Byrne' : 'Tap to sign on screen'}
              </Text>
            </View>
          </PressableScale>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(12, 12 + insets.bottom) }]}>
        <PressableScale
          onPress={() => {
            if (state.submitted) {
              dispatch({ type: 'GO', screen: 'activity' });
            } else if (state.signed) {
              dispatch({ type: 'SUBMIT', pay: payTotal });
            } else {
              dispatch({
                type: 'SHOW_TOAST',
                message: 'Ask the ward manager to sign first',
              });
            }
          }}
          style={submitStyle(state)}>
          <Text style={submitTextStyle(state)}>
            {state.submitted
              ? 'Submitted · view status'
              : state.signed
                ? 'Submit timesheet'
                : 'Sign to submit'}
          </Text>
        </PressableScale>
        <Text style={styles.footerNote}>
          Submitted before Sunday 23:59 · paid Friday
        </Text>
      </View>
    </View>
  );
}

function submitStyle(state: { submitted: boolean; signed: boolean }) {
  if (state.submitted) {
    return styles.submitDone;
  }
  if (state.signed) {
    return styles.submitActive;
  }
  return styles.submitDisabled;
}

function submitTextStyle(state: { submitted: boolean; signed: boolean }) {
  if (state.submitted) {
    return styles.submitDoneText;
  }
  if (state.signed) {
    return styles.submitActiveText;
  }
  return styles.submitDisabledText;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
    flexShrink: 0,
  },
  title: {
    fontSize: 19,
    fontFamily: fonts.bold,
    letterSpacing: -0.532,
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.onNavyMuted,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    gap: 16,
  },
  submittedBox: {
    backgroundColor: colors.blueBg,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    gap: 9,
  },
  submittedTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  submittedSub: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.blueDeep,
    textAlign: 'center',
    lineHeight: 18.85,
  },
  sheetCard: {
    padding: 18,
    gap: 15,
  },
  clockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clockCol: {
    gap: 4,
  },
  clockColRight: {
    alignItems: 'flex-end',
  },
  clockLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 1.08,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  clockValue: {
    fontSize: 26,
    fontFamily: fonts.extraBold,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  innerRule: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  breakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSlate,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepDown: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepUp: {
    width: 40,
    height: 40,
    backgroundColor: colors.blueBg,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakValue: {
    minWidth: 56,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  payBox: {
    backgroundColor: colors.bg,
    borderRadius: 14,
    padding: 14,
    gap: 9,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  payRowLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSlate,
  },
  payRowValue: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  payBoxRule: {
    height: 1,
    backgroundColor: colors.border,
  },
  payTotalLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 1.08,
    color: colors.berryMid,
    textTransform: 'uppercase',
  },
  payTotalValue: {
    fontSize: 20,
    fontFamily: fonts.extraBold,
    color: colors.berry,
    fontVariant: ['tabular-nums'],
  },
  payNote: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  fieldSection: {
    gap: 9,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  notesBox: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 13,
    minHeight: 46,
  },
  notesPlaceholder: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted2,
  },
  signBox: {
    backgroundColor: colors.white,
    borderRadius: 14,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  signLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 9,
    flexShrink: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(13,45,94,0.07)',
  },
  submitActive: {
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  submitActiveText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  submitDisabled: {
    backgroundColor: colors.border,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  submitDisabledText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.disabledText,
  },
  submitDone: {
    backgroundColor: colors.blueBg,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  submitDoneText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.blueDeep,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  homeIndicator: {
    height: 5,
    width: 126,
    borderRadius: 3,
    backgroundColor: colors.indicator,
    alignSelf: 'center',
  },
});
