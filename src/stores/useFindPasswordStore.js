'use client';

import { create } from 'zustand';

export const useFindPasswordStore = create((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
  code: '',
  setCode: (code) => set({ code }),
  reset: () => set({ email: '', code: '' }),
}));
