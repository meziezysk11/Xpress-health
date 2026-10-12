import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { configureApiClient } from '../../api/client';
import { User } from '../../api/types';

interface AuthStore {
  token: string | null;
  user: User | null;
  welcomeSeen: boolean;
  /** False until the persisted session has been read back from storage. */
  hydrated: boolean;
  setSession: (user: User, token: string) => void;
  updateUser: (patch: Partial<User>) => void;
  clearSession: () => void;
  markWelcomeSeen: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      welcomeSeen: false,
      hydrated: false,
      setSession: (user, token) => set({ user, token }),
      updateUser: (patch) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...patch } });
      },
      clearSession: () => set({ user: null, token: null }),
      markWelcomeSeen: () => set({ welcomeSeen: true }),
    }),
    {
      name: 'candidate-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ token, user, welcomeSeen }) => ({ token, user, welcomeSeen }),
      onRehydrateStorage: () => () => useAuthStore.setState({ hydrated: true }),
    },
  ),
);

configureApiClient({
  getToken: () => useAuthStore.getState().token,
  onUnauthorized: () => useAuthStore.getState().clearSession(),
});
