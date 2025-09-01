'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function useChangePW() {
  const [statusCode, setStatusCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }) => {
      if (!currentPassword || !newPassword || !confirmPassword) return;
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.put('users/me/password', {
          currentPassword,
          newPassword,
          confirmPassword,
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
    []
  );

  const reset = () => {
    setError(null);
    setStatusCode(null);
  };

  return { mutate, statusCode, loading, error, reset };
}
