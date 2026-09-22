import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AppState,
  Filters,
  ScreenName,
  START_STATE,
} from '../data/model';
import { money } from './derive';

export type AppAction =
  | { type: 'SIGN_IN' }
  | { type: 'SIGN_OUT' }
  | { type: 'GO'; screen: ScreenName }
  | { type: 'TOGGLE_FILTER'; key: keyof Filters }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'OPEN_DETAIL'; id: string }
  | { type: 'BOOK'; id: string; place: string; amount: number }
  | { type: 'TOGGLE_CLOCK' }
  | { type: 'ACCEPT'; id: string; place: string }
  | { type: 'DECLINE'; id: string; place: string }
  | { type: 'BREAK_DELTA'; delta: number }
  | { type: 'SIGN_SHEET' }
  | { type: 'SUBMIT'; pay: number }
  | { type: 'ADD_OH' }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, signedIn: true, screen: 'home' };
    case 'SIGN_OUT':
      return { ...START_STATE };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'GO':
      return { ...state, screen: action.screen };
    case 'TOGGLE_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: !state.filters[action.key] },
      };
    case 'CLEAR_FILTERS':
      return { ...state, filters: { rate: false, near: false, days: false } };
    case 'OPEN_DETAIL':
      return { ...state, detailId: action.id, screen: 'detail' };
    case 'BOOK':
      return {
        ...state,
        booked: state.booked.concat([action.id]),
        screen: 'schedule',
        toast: `Booked ${action.place} · ${money(action.amount)}`,
      };
    case 'TOGGLE_CLOCK':
      return {
        ...state,
        clockedIn: !state.clockedIn,
        toast: !state.clockedIn
          ? 'Clocked in at Beaumont · 07:58'
          : 'Clocked out · timesheet ready to submit',
      };
    case 'ACCEPT':
      return {
        ...state,
        accepted: state.accepted.concat([action.id]),
        toast: `Booked — ${action.place} added to your schedule`,
      };
    case 'DECLINE':
      return {
        ...state,
        declined: state.declined.concat([action.id]),
        toast: `Declined ${action.place}`,
      };
    case 'BREAK_DELTA':
      return {
        ...state,
        breakMin: Math.min(90, Math.max(0, state.breakMin + action.delta)),
      };
    case 'SIGN_SHEET':
      return { ...state, signed: true, toast: 'Signature captured' };
    case 'SUBMIT':
      return {
        ...state,
        submitted: true,
        toast: `Timesheet submitted · ${money(action.pay)} due Friday`,
      };
    case 'ADD_OH':
      return {
        ...state,
        ohAdded: true,
        toast: 'Occupational health form uploaded',
      };
    case 'SHOW_TOAST':
      return { ...state, toast: action.message };
    default:
      return state;
  }
}

const SIGN_OUT_STATE: AppState = { ...START_STATE };

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  flash: (message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, START_STATE);

  // The design keeps a toast on screen for 2.6s.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!state.toast) return;
    timer.current = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state.toast]);

  const flash = useCallback((message: string) => {
    dispatch({ type: 'SHOW_TOAST', message });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ state, dispatch, flash }),
    [state, flash],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useReducerCompat(reducerFn: typeof reducer) {
  return React.useReducer(reducerFn, START_STATE);
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
