'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useAuthStore } from '@/stores/useAuthStore';

function normalizeInfo(item) {
  return {
    userId: item?.userId ?? null,
    profileImageUrl: item?.profileImageUrl ?? null,
    nickname: item?.nickname ?? '',
    username: item?.username ?? '',
    email: item?.email ?? '',
  };
}

export default function useUserInfo() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get('users/me');
      const apiContent = res.data?.content || null;

      if (!mountedRef.current) return;
      if (apiContent) {
        setUser(normalizeInfo(apiContent));
      } else {
        clearUser();
      }
    } catch (e) {
      if (!mountedRef.current) return;
      clearUser();
      setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [setUser, clearUser]);

  useEffect(() => {
    mountedRef.current = true;
    refetch();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  const data = useMemo(() => user, [user]);

  return { info: data, loading, error, refetch };
}
