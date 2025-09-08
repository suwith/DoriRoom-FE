'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosInstance from '@/lib/axiosInstance';
import LoadingContent from '@/app/_components/LoadingContent';

export default function AuthBootstrap({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [serverDown, setServerDown] = useState(false);

  const { getStoredTokens, setTokens, clearTokens } = useAuthStore();

  useEffect(() => {
    // 전역 axios 인터셉터로 500 감지
    const interceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 500) {
          setServerDown(true);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (serverDown) return; // 점검 중이면 auth 로직도 막음

    const isAuthPage =
      pathname?.startsWith('/login') ||
      pathname?.startsWith('/signup') ||
      pathname?.startsWith('/auth');

    const tokens = getStoredTokens();

    if (tokens?.accessToken) {
      setTokens(tokens.accessToken, tokens.refreshToken, tokens.kind);
      setReady(true);
      return;
    }

    if (!isAuthPage) {
      clearTokens();
      router.replace('/auth');
    }

    setReady(true);
  }, [pathname, router, getStoredTokens, setTokens, clearTokens, serverDown]);

  if (serverDown) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            서버 점검 중입니다.
          </h1>
          <p className="mt-2 text-gray-600">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <LoadingContent loading={true} className="w-[300px]" />
      </div>
    );
  }

  return children;
}
