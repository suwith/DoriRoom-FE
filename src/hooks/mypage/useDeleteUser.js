'use client';

import axiosInstance from '@/lib/axiosInstance';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function useDeleteUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearTokens = useAuthStore((s) => s.clearTokens);
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (password) => {
      if (!password) return;
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.post('users/me/withdraw', { password });

        const apiContent = res.data;
        if (!mountedRef.current) return;
        if (apiContent.statusCode === 200) {
          clearTokens();
          clearUser();
          delete axiosInstance.defaults.headers.Authorization;
          router.replace('/auth');
        }
        setData(apiContent);
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
    setData(null);
    setError(null);
  };

  return { mutate, data, loading, error, reset };
}
