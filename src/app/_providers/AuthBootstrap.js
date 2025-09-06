'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthBootstrap({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const { getStoredTokens, setTokens, clearTokens } = useAuthStore();

  useEffect(() => {
    const isAuthPage =
      pathname?.startsWith('/login') || pathname?.startsWith('/signup');

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
  }, [pathname, router, getStoredTokens, setTokens, clearTokens]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <img
          src="/images/doriroom_logo.svg"
          alt="Dori Room"
          className="w-32 h-32"
        />
      </div>
    );
  }

  return children;
}
