import { create } from 'zustand';

export type TabName = 'home' | 'jobs' | 'applications' | 'profile';

export type Route =
  | { name: TabName }
  | { name: 'job'; jobId: string }
  | { name: 'apply'; jobId: string };

interface NavigationStore {
  stack: Route[];
  /** Switch tab — resets the stack to that tab's root. */
  go: (tab: TabName) => void;
  push: (route: Route) => void;
  /** Pops one route; returns false when already at a tab root. */
  back: () => boolean;
  reset: () => void;
}

const ROOT: Route[] = [{ name: 'home' }];

export const useNavigation = create<NavigationStore>((set, get) => ({
  stack: ROOT,
  go: (tab) => set({ stack: [{ name: tab }] }),
  push: (route) => set({ stack: [...get().stack, route] }),
  back: () => {
    const { stack } = get();
    if (stack.length > 1) {
      set({ stack: stack.slice(0, -1) });
      return true;
    }
    if (stack[0].name !== 'home') {
      set({ stack: ROOT });
      return true;
    }
    return false;
  },
  reset: () => set({ stack: ROOT }),
}));

export const currentRoute = (stack: Route[]) => stack[stack.length - 1];

/** The tab a route belongs to, for highlighting the tab bar. */
export const routeTab = (stack: Route[]): TabName => stack[0].name as TabName;
