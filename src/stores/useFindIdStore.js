'use client';

import { create } from 'zustand';

export const useFindIdStore = create((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
  username: null,
  setUsername: (username) => set({ username }),
  reset: () => set({ email: '', username: null }),
}));
