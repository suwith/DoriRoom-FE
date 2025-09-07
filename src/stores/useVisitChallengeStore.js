'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useVisitChallengeStore = create()(
  persist(
    (set) => ({
      session: {
        active: false,
        challengeId: null,
        regionId: null,
        requiredMs: 10 * 60 * 1000,
        startedAt: null,
        enteredAt: null,
        polygon: null,
        outsideSince: null,
        inside: false,
      },
      lastCompleted: null,
      start: ({ challengeId, regionId, polygon, requiredMs }) =>
        set({
          session: {
            active: true,
            challengeId,
            regionId: regionId ?? null,
            requiredMs: requiredMs ?? 10 * 60 * 1000,
            startedAt: Date.now(),
            enteredAt: null, // 연속 체크는 영역 들어온 순간부터
            polygon,
            elapsedMs: 0,
            outsideSince: null,
            inside: false,
          },
        }),
      stop: () =>
        set({
          session: {
            active: false,
            challengeId: null,
            regionId: null,
            requiredMs: 10 * 60 * 1000,
            startedAt: null,
            enteredAt: null,
            polygon: null,
            elapsedMs: 0,
            outsideSince: null,
            inside: false,
          },
        }),
      setInside: (v) =>
        set((s) =>
          s.session.inside === v ? s : { session: { ...s.session, inside: v } }
        ),
      setElapsed: (ms) =>
        set((s) =>
          s.session.elapsedMs === ms
            ? s
            : { session: { ...s.session, elapsedMs: ms } }
        ),
      setEnteredAt: (ts) =>
        set((s) =>
          s.session.enteredAt === ts
            ? s
            : { session: { ...s.session, enteredAt: ts } }
        ),
      setOutsideSince: (ts) =>
        set((s) =>
          s.session.outsideSince === ts
            ? s
            : { session: { ...s.session, outsideSince: ts } }
        ),
      markCompleted: ({ challengeId, regionId }) =>
        set((s) => ({
          ...s,
          lastCompleted: { challengeId, regionId, at: Date.now() },
        })),
      clearLastCompleted: () =>
        set((s) =>
          s.lastCompleted === null ? s : { ...s, lastCompleted: null }
        ),
    }),
    { name: 'visit-challenge' }
  )
);
