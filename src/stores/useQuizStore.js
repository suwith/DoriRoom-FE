'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  score: 0,
  correctCount: 0,
  answers: {},
};

export const useQuizStore = create(
  persist(
    (set) => ({
      ...initialState,
      setAnswer: (qId, picked, isCorrect) =>
        set((s) => {
          if (s.answers[qId]?.picked !== undefined) return s;

          return {
            answers: { ...s.answers, [qId]: { picked, correct: isCorrect } },
            correctCount: isCorrect ? s.correctCount + 1 : s.correctCount,
            score: isCorrect ? s.score + 1 : s.score,
          };
        }),
      reset: () => set(initialState),
    }),
    {
      name: 'quiz-store',
      partialize: (s) => ({
        score: s.score,
        correctCount: s.correctCount,
        answers: s.answers,
      }),
    }
  )
);
