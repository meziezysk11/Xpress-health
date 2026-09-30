import { createStore } from 'zustand/vanilla';

import { START_STATE } from '../../data/model';
import { toastStore } from './toastStore';

interface ClockStore {
  clockedIn: boolean;
  breakMin: number;
  toggleClock: () => void;
  adjustBreak: (delta: number) => void;
  reset: () => void;
}

export const clockStore = createStore<ClockStore>((set, get) => ({
  clockedIn: START_STATE.clockedIn,
  breakMin: START_STATE.breakMin,
  toggleClock: () => {
    const clockedIn = !get().clockedIn;
    set({ clockedIn });
    toastStore.getState().flash(
      clockedIn
        ? 'Clocked in at Beaumont · 07:58'
        : 'Clocked out · timesheet ready to submit',
    );
  },
  adjustBreak: (delta) =>
    set({ breakMin: Math.min(90, Math.max(0, get().breakMin + delta)) }),
  reset: () =>
    set({ clockedIn: START_STATE.clockedIn, breakMin: START_STATE.breakMin }),
}));