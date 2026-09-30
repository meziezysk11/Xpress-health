import { createStore } from 'zustand/vanilla';

interface ToastStore {
  toast: string | null;
  flash: (message: string) => void;
  clearToast: () => void;
  reset: () => void;
}

export const toastStore = createStore<ToastStore>((set) => ({
  toast: null,
  flash: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
  reset: () => set({ toast: null }),
}));