import { createStore } from 'zustand/vanilla';

import { ScreenName, START_STATE } from '../../data/model';

interface NavigationStore {
  screen: ScreenName;
  detailId: string;
  go: (screen: ScreenName) => void;
  openDetail: (id: string) => void;
  reset: () => void;
}

export const navigationStore = createStore<NavigationStore>((set) => ({
  screen: START_STATE.screen,
  detailId: START_STATE.detailId,
  go: (screen) => set({ screen }),
  openDetail: (detailId) => set({ detailId, screen: 'detail' }),
  reset: () => set({ screen: START_STATE.screen, detailId: START_STATE.detailId }),
}));