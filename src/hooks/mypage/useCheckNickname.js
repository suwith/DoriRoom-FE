'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useEffect, useState, useCallback, useRef } from 'react';

export default function useCheckNickname() {
  const [statusCode, setStatusCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async ({ nickname }) => {
    if (!nickname) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('users/check-nickname', {
        params: { nickname: nickname },
      });
      const statusCode = res.data?.statusCode;
      const error = res.data?.error;

      if (!mountedRef.current) return;
      if (statusCode !== 200) setError(error);
      setStatusCode(statusCode);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { statusCode, loading, error, refetch };
}
