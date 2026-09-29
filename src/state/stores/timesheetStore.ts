import { createStore } from 'zustand/vanilla';

import { START_STATE } from '../../data/model';
import { money } from '../derive';
import { toastStore } from './toastStore';

interface TimesheetStore {
  signed: boolean;
  submitted: boolean;
  signSheet: () => void;
  submit: (pay: number) => void;
  reset: () => void;
}

export const timesheetStore = createStore<TimesheetStore>((set) => ({
  signed: START_STATE.signed,
  submitted: START_STATE.submitted,
  signSheet: () => {
    set({ signed: true });
    toastStore.getState().flash('Signature captured');
  },
  submit: (pay) => {
    set({ submitted: true });
    toastStore.getState().flash(`Timesheet submitted · ${money(pay)} due Friday`);
  },
  reset: () => set({ signed: START_STATE.signed, submitted: START_STATE.submitted }),
}));