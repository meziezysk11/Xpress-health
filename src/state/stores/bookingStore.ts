import { createStore } from 'zustand/vanilla';

import { Filters, START_STATE } from '../../data/model';
import { money } from '../derive';
import { navigationStore } from './navigationStore';
import { toastStore } from './toastStore';

interface BookingStore {
  filters: Filters;
  booked: string[];
  accepted: string[];
  declined: string[];
  toggleFilter: (key: keyof Filters) => void;
  clearFilters: () => void;
  book: (id: string, place: string, amount: number) => void;
  accept: (id: string, place: string) => void;
  decline: (id: string, place: string) => void;
  reset: () => void;
}

export const bookingStore = createStore<BookingStore>((set, get) => ({
  filters: { ...START_STATE.filters },
  booked: [],
  accepted: [],
  declined: [],
  toggleFilter: (key) =>
    set({ filters: { ...get().filters, [key]: !get().filters[key] } }),
  clearFilters: () => set({ filters: { rate: false, near: false, days: false } }),
  book: (id, place, amount) => {
    set({ booked: get().booked.concat([id]) });
    navigationStore.getState().go('schedule');
    toastStore.getState().flash(`Booked ${place} · ${money(amount)}`);
  },
  accept: (id, place) => {
    set({ accepted: get().accepted.concat([id]) });
    toastStore.getState().flash(`Booked — ${place} added to your schedule`);
  },
  decline: (id, place) => {
    set({ declined: get().declined.concat([id]) });
    toastStore.getState().flash(`Declined ${place}`);
  },
  reset: () =>
    set({
      filters: { ...START_STATE.filters },
      booked: [],
      accepted: [],
      declined: [],
    }),
}));