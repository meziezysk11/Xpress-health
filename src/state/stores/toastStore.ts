import { create } from 'zustand';

export interface ToastMessage {
  message: string;
  kind: 'success' | 'error';
}

interface ToastStore {
  toast: ToastMessage | null;
  flash: (message: string, kind?: ToastMessage['kind']) => void;
  clearToast: () => void;
}

export const useToast = create<ToastStore>((set) => ({
  toast: null,
  flash: (message, kind = 'success') => set({ toast: { message, kind } }),
  clearToast: () => set({ toast: null }),
}));

export const flash = (message: string, kind?: ToastMessage['kind']) =>
  useToast.getState().flash(message, kind);
