'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useAuthStore } from '@/stores/useAuthStore';

export default function useLogout() {
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await axiosInstance.post('/auth/logout');
    } catch (_) {
      // 실패해도 무조건 정리
    } finally {
      clearTokens();
      clearUser();
      delete axiosInstance.defaults.headers.Authorization;
      setLoggingOut(false);
      router.replace('/auth'); // 로그아웃 후 /auth 화면으로 이동
    }
  }, [clearTokens, clearUser, router]);

  return { logout, loggingOut };
}
