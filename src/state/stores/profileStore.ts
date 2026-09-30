import { createStore } from 'zustand/vanilla';

import { START_STATE } from '../../data/model';
import { toastStore } from './toastStore';

interface ProfileStore {
  ohAdded: boolean;
  addOccupationalHealth: () => void;
  reset: () => void;
}

export const profileStore = createStore<ProfileStore>((set) => ({
  ohAdded: START_STATE.ohAdded,
  addOccupationalHealth: () => {
    set({ ohAdded: true });
    toastStore.getState().flash('Occupational health form uploaded');
  },
  reset: () => set({ ohAdded: START_STATE.ohAdded }),
}));