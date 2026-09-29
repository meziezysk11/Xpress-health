import { createStore } from 'zustand/vanilla';

import { START_STATE } from '../../data/model';
import { bookingStore } from './bookingStore';
import { clockStore } from './clockStore';
import { navigationStore } from './navigationStore';
import { profileStore } from './profileStore';
import { timesheetStore } from './timesheetStore';
import { toastStore } from './toastStore';

interface AuthStore {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  reset: () => void;
}

export const authStore = createStore<AuthStore>((set) => ({
  signedIn: START_STATE.signedIn,
  signIn: () => set({ signedIn: true }),
  signOut: () => {
    set({ signedIn: false });
    navigationStore.getState().reset();
    bookingStore.getState().reset();
    clockStore.getState().reset();
    timesheetStore.getState().reset();
    profileStore.getState().reset();
    toastStore.getState().reset();
  },
  reset: () => set({ signedIn: START_STATE.signedIn }),
}));