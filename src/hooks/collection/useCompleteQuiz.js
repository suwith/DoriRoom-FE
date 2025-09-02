'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

function normalizeQuiz(api) {
  if (!api) return null;
  return {
    success: api.success,
    rewards: api.rewards,
  };
}

export default function useCompleteQuiz(handler) {
  const { onSuccess, onError } = handler;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = true;
    };
  }, []);

  const mutate = useCallback(
    async ({ challengeId }) => {
      if (!challengeId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.post(`quizzes/${challengeId}/complete`);

        const apiContent = res.data?.content || null;

        if (!mountedRef.current) return;
        onSuccess?.();
        setData(normalizeQuiz(apiContent));
      } catch (err) {
        if (!mountedRef.current) return;
        onError?.();
        setError(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [loading, onSuccess, onError]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
