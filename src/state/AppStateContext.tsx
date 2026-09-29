import React, { useEffect } from 'react';
import { useStore } from 'zustand';

import { AppState } from '../data/model';
import { authStore } from './stores/authStore';
import { bookingStore } from './stores/bookingStore';
import { clockStore } from './stores/clockStore';
import { navigationStore } from './stores/navigationStore';
import { profileStore } from './stores/profileStore';
import { timesheetStore } from './stores/timesheetStore';
import { toastStore } from './stores/toastStore';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const toast = useStore(toastStore, (store) => store.toast);

  useEffect(() => {
    authStore.getState().signOut();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => toastStore.getState().clearToast(), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  return <>{children}</>;
}

export function useApp() {
  const auth = useStore(authStore);
  const navigation = useStore(navigationStore);
  const booking = useStore(bookingStore);
  const clock = useStore(clockStore);
  const timesheet = useStore(timesheetStore);
  const profile = useStore(profileStore);
  const toast = useStore(toastStore);

  const state: AppState = {
    signedIn: auth.signedIn,
    screen: navigation.screen,
    detailId: navigation.detailId,
    filters: booking.filters,
    booked: booking.booked,
    accepted: booking.accepted,
    declined: booking.declined,
    clockedIn: clock.clockedIn,
    breakMin: clock.breakMin,
    signed: timesheet.signed,
    submitted: timesheet.submitted,
    ohAdded: profile.ohAdded,
    toast: toast.toast,
  };

  return {
    state,
    signIn: auth.signIn,
    signOut: auth.signOut,
    go: navigation.go,
    openDetail: navigation.openDetail,
    toggleFilter: booking.toggleFilter,
    clearFilters: booking.clearFilters,
    book: booking.book,
    accept: booking.accept,
    decline: booking.decline,
    toggleClock: clock.toggleClock,
    adjustBreak: clock.adjustBreak,
    signSheet: timesheet.signSheet,
    submit: timesheet.submit,
    addOccupationalHealth: profile.addOccupationalHealth,
    flash: toast.flash,
  };
}

