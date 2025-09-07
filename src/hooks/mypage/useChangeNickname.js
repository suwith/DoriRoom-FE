'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function useChangeNickname() {
  const [statusCode, setStatusCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async ({ nickname }) => {
      if (!nickname) return;
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.put('users/me/profile', {
          nickname,
        });

        const status = res.data.statusCode;
        const error = res.data.error;
        if (!mountedRef.current) return;
        setStatusCode(status);
        setError(error);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [loading]
  );

  const reset = () => {
    setError(null);
    setStatusCode(null);
  };

  return { mutate, statusCode, loading, error, reset };
}
