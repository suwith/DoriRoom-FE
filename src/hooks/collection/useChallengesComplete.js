'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function useChallengesComplete(handler = {}) {
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
        const res = await axiosInstance.post(
          `challenges/${challengeId}/complete`
        );
        const apiContent = res.data?.statusCode;
        if (!mountedRef.current) return;
        onSuccess?.();
        setData(apiContent);
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
