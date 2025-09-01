// hooks/auth/useSignupStore.js
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSignupStore = create(
  persist(
    (set) => ({
      email: '',
      profile: {
        username: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        avatarFile: null,
      },
      setEmail: (email) => set({ email }),
      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
      reset: () =>
        set({
          email: '',
          profile: {
            username: '',
            password: '',
            passwordConfirm: '',
            nickname: '',
            avatarFile: null,
          },
        }),
    }),
    {
      name: 'signup-storage',
      partialize: (state) => ({
        email: state.email,
        profile: {
          username: state.profile.username,
          nickname: state.profile.nickname,
        },
      }),
    }
  )
);
