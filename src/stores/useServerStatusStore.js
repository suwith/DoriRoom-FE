import { create } from 'zustand';

export const useServerStatusStore = create((set) => ({
  serverDown: false,
  setServerDown: (down) => set({ serverDown: down }),
}));
