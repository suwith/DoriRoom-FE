// hooks/auth/useSignupStore.js
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSignupStore = create(
  persist(
    (set, get) => ({
      email: '',
      profile: {
        username: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        avatarFile: null,
      },

      // 이메일 저장
      setEmail: (email) => set({ email }),

      // 프로필 필드 병합
      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      // 초기화
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

      // 저장할 필드 최소화 (민감한 비밀번호 제외)
      partialize: (state) => ({
        email: state.email,
        profile: {
          username: state.profile.username,
          nickname: state.profile.nickname,
        },
      }),

      // 복원 시 누락된 필드 보완
      merge: (persisted, current) => {
        return {
          ...current,
          ...persisted,
          profile: {
            username: persisted?.profile?.username ?? '',
            password: '',
            passwordConfirm: '',
            nickname: persisted?.profile?.nickname ?? '',
            avatarFile: null,
          },
        };
      },
    }
  )
);
