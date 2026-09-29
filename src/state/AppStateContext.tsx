import React, { useEffect } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

import {
  AppState,
  Filters,
  ScreenName,
  START_STATE,
} from '../data/model';
import { money } from './derive';

interface AppActions {
  signIn: () => void;
  signOut: () => void;
  go: (screen: ScreenName) => void;
  toggleFilter: (key: keyof Filters) => void;
  clearFilters: () => void;
  openDetail: (id: string) => void;
  book: (id: string, place: string, amount: number) => void;
  toggleClock: () => void;
  accept: (id: string, place: string) => void;
  decline: (id: string, place: string) => void;
  adjustBreak: (delta: number) => void;
  signSheet: () => void;
  submit: (pay: number) => void;
  addOccupationalHealth: () => void;
  flash: (message: string) => void;
  clearToast: () => void;
}

interface AppStore extends AppActions {
  state: AppState;
}

const appStore = createStore<AppStore>((set, get) => ({
  state: START_STATE,
  signIn: () =>
    set({ state: { ...get().state, signedIn: true, screen: 'home' } }),
  signOut: () => set({ state: { ...START_STATE } }),
  go: (screen) => set({ state: { ...get().state, screen } }),
  toggleFilter: (key) => {
    const state = get().state;
    set({
      state: {
        ...state,
        filters: { ...state.filters, [key]: !state.filters[key] },
      },
    });
  },
  clearFilters: () =>
    set({
      state: {
        ...get().state,
        filters: { rate: false, near: false, days: false },
      },
    }),
  openDetail: (id) =>
    set({ state: { ...get().state, detailId: id, screen: 'detail' } }),
  book: (id, place, amount) =>
    set({
      state: {
        ...get().state,
        booked: get().state.booked.concat([id]),
        screen: 'schedule',
        toast: `Booked ${place} · ${money(amount)}`,
      },
    }),
  toggleClock: () => {
    const clockedIn = !get().state.clockedIn;
    set({
      state: {
        ...get().state,
        clockedIn,
        toast: clockedIn
          ? 'Clocked in at Beaumont · 07:58'
          : 'Clocked out · timesheet ready to submit',
      },
    });
  },
  accept: (id, place) =>
    set({
      state: {
        ...get().state,
        accepted: get().state.accepted.concat([id]),
        toast: `Booked — ${place} added to your schedule`,
      },
    }),
  decline: (id, place) =>
    set({
      state: {
        ...get().state,
        declined: get().state.declined.concat([id]),
        toast: `Declined ${place}`,
      },
    }),
  adjustBreak: (delta) =>
    set({
      state: {
        ...get().state,
        breakMin: Math.min(90, Math.max(0, get().state.breakMin + delta)),
      },
    }),
  signSheet: () =>
    set({ state: { ...get().state, signed: true, toast: 'Signature captured' } }),
  submit: (pay) =>
    set({
      state: {
        ...get().state,
        submitted: true,
        toast: `Timesheet submitted · ${money(pay)} due Friday`,
      },
    }),
  addOccupationalHealth: () =>
    set({
      state: {
        ...get().state,
        ohAdded: true,
        toast: 'Occupational health form uploaded',
      },
    }),
  flash: (message) => set({ state: { ...get().state, toast: message } }),
  clearToast: () => set({ state: { ...get().state, toast: null } }),
}));

export function AppProvider({ children }: { children: React.ReactNode }) {
  const toast = useStore(appStore, (store) => store.state.toast);

  useEffect(() => {
    appStore.setState({ state: START_STATE });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(
      () => appStore.getState().clearToast(),
      2600,
    );
    return () => clearTimeout(timer);
  }, [toast]);

  return <>{children}</>;
}

export function useApp() {
  return useStore(appStore);
}
