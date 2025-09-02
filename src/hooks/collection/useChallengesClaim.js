'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function useChallengesClaim(handler) {
  const { onSuccess, onError } = handler;
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
        await axiosInstance.post(`challenges/${challengeId}/claim`);
        if (!mountedRef.current) return;
        onSuccess?.();
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

  return { mutate, loading, error, reset };
}
